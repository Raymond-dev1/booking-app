import {accessToken} from "./token.service.js";
import { db } from "../db/index.js";
import { users , businesses, services, staff_availability, staff_services, bookings} from "../db/schema.js";
import {eq} from "drizzle-orm"
import bcrypt from "bcrypt"

type CreateUserInput = {
    first_name: string;
    last_name: string;
    email: string;
    password:string;
}

type LoginUserInput= {
    email:string;
    password:string;
}

type Role ="guest" | "customer" |"owner" |"staff"

//creates user
export const createUser= async ({first_name, last_name, email, password}: CreateUserInput , role:Role) =>{
    try{
        const existingUser =await db.select().from(users).where(eq(users.email,email))
        if(existingUser.length >0){
            return{status:409,success: false, message: "user already Exists"}
        }

        const validRoles: Role[] =['guest', 'customer', 'owner', 'staff']
        if(!validRoles.includes(role)){
            return{status:400, success: false, message: "invalid roles"}
        }
        if(role == "staff"){
            return{status: 403, success:false, message: "staffs accounts are only created by invitation"}
        }
        const hashed = await bcrypt.hash(password, 10)
        const newUser = await db.insert(users).values({
            first_name: first_name,
            last_name,
            email,
            password_hash: hashed,
            is_active: true,
            role
        }).returning()
                
        const token  =accessToken(newUser[0]!.id,newUser[0]!.role ?? role)
        const {password_hash, ...userData} =newUser[0]!
        
        return {status:201, success: true, message: "user created successfully", token , data: userData}
    }catch(error){
        console.error("Error creating user:",error)
        return {status:500, success: false, message: "internal server error"}
    }
}

//Logins user
export const loginUser = async ({email, password}: LoginUserInput) =>{
    try{
        const existingUser  = await db.select().from(users).where(eq(users.email, email));

        if(existingUser.length ===0 ){
            return{status:404, success:false, message: "user not found"}
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser[0]!.password_hash!)
        if(!isPasswordValid){
            return{status:401, success:false, message: "invalid credentials"}
        }

        const { password_hash, ...userData }= existingUser[0]!
        const role = existingUser[0]!.role!

        const token  =accessToken(existingUser[0]!.id, role )
        return {status:200, success: true, token, message: "login successful", data: userData}
    }catch(error){
        console.error("Error logging in user:", error)
        return{status:500,success:false, message: "internal server error"}
    }
}

//Fetches user
export const getUserById =async (id:number) =>{
    try{
        const customer = await db.select().from(users).where(eq(users.id, id));
        return{status:200, success:true, message: "user ", customer }
    }catch(error){
        console.error("Error fetching customer;", error)
        return{status:500, message: "internal server error"}
    }
}
