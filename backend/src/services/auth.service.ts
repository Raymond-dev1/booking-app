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
        const token = accessToken(newCustomer[0]!.id)
        const {password_hash, ...customerData} =newCustomer[0]!
        
        return {status:201, success: true, message: "customer created successfully", token , data: customerData}
    }catch(error){
        console.error("Error creating customer:",error)
        return {status:500, success: false, message: "internal server error"}
    }
}
