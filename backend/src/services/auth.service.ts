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

export const createCustomer= async ({first_name, last_name, email, password}: CreateUserInput) =>{
    try{
        const existingCustomer =await db.select().from(users).where(eq(users.email,email))
        if(existingCustomer.length >0){
            return{status:409,success: false, message: "user already Exists"}
        }
        const hashed = await bcrypt.hash(password, 10)
        const newCustomer = await db.insert(users).values({
            first_name: first_name,
            last_name,
            email,
            password_hash: hashed,
            is_active: true,
            role: "customer"
        }).returning()
                
        const token  =accessToken(existingCustomer[0]!.id,existingCustomer[0]!.role ?? "customer")
        const {password_hash, ...customerData} =newCustomer[0]!
        
        return {status:201, success: true, message: "customer created successfully", token , data: customerData}
    }catch(error){
        console.error("Error creating customer:",error)
        return {status:500, success: false, message: "internal server error"}
    }
}

export const loginCustomer = async ({email, password}: LoginUserInput) =>{
    try{
        const existingCustomer  = await db.select().from(users).where(eq(users.email, email));

        if(existingCustomer.length ===0 ){
            return{status:404, success:false, message: "user not found"}
        }

        const isPasswordValid = await bcrypt.compare(password,existingCustomer[0]!.password_hash!)
        if(!isPasswordValid){
            return{status:401, success:false, message: "invalid credentials"}
        }

        const { password_hash, ...customerData }= existingCustomer[0]!

        const role = existingCustomer[0]!.role
        if(role !== "customer"){
            return{status: 403, success:false, message: "Forbidden ; insufficient permissions"}
        }
        
        const token  =accessToken(existingCustomer[0]!.id, existingCustomer[0]!.role ?? "customer")
        return {status:200, success: true, token, message: "login successful", data: customerData}
    }catch(error){
        console.error("Error loggin in customer:", error)
        return{status:500,success:false, message: "internal server error"}
    }
}


export const getCustomerById =async (id:number) =>{
    try{
        const customer = await db.select().from(users).where(eq(users.id, id));
        return{status:200, success:true, message: "user ", customer }
    }catch(error){
        console.error("Error fetching customer;", error)
        return{status:500, message: "internal server error"}
    }
}
