import {eq} from "drizzle-orm";
import { db } from "../db/index.js";
import { users ,services, } from "../db/schema.js";

type CreateServiceInput = {
    business_id:number,
    name:string,
    duration_minutes:number,
    buffer_mins: number,
    price:string,
    description: string,
}

type PaymentType ="pay_now" | "pay_on_arrival" | "free"

export const createService =async({business_id, name , duration_minutes, buffer_mins, price, description}: CreateServiceInput, payment_type:PaymentType) =>{
    try{
        const existingService = await db.select().from(services).where(eq(services.name, name))
        if(existingService.length > 0){
            return {status:409 , success:false, message: "service already exists"}
        }
        const newService = await db.insert(services).values({
            business_id,
            name,
            duration_minutes,
            buffer_mins,
            price,
            description,
            payment_type, 
            is_active:true
        }).returning()
        return {status:201, success:true, message :"service created successfully", data: newService[0]}
    }catch(error){
        console.error("Error creating service", error)
        return {status:500, success:false, message: "internal server error"}
    }
} 

export const deleteService = async (serviceId: number) =>{ 
    try{
        const service = await db.select().from(services).where(eq(services.id, serviceId))
        if(!service.length){
            return {status:404, success:false, message: "service not found"}
        }
        await db.delete(services).where(eq(services.id, serviceId))
        return {status:200, success:true, message: "service deleted successfully"}
    }catch(error){
        console.error("Error deleting service", error)
        return {status:500, success:false, message: "internal server error"}
    }
}

