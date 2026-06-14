import {accessToken, inviteStaffToken} from "./token.service.js";
import { db } from "../db/index.js";
import {eq, and} from "drizzle-orm"
import { users , services, staff_availability, staff_services} from "../db/schema.js";
import bcrypt from "bcrypt"
import {sendInviteEmail} from "../services/mail.service.js"

type CreateStaffInput = {
    first_name: string,
    last_name: string,
    email: string,
    phone_number :string
}

type availabilityEngineInput = {
    staff_id:number,
    start_time:string,
    end_time:string,

};

type updateAvailabilityInput= {
    id:number,
    staff_id: number,
    start_time:string,
    end_time:string
}
type role=  "staff"
type dayOfTheWeekEnum = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";


export const inviteStaff = async({email, first_name, last_name, phone_number}: CreateStaffInput,role: role ) =>{
    try{
        const existingStaff = await  db.select().from(users).where(eq(users.email, email))
        if(existingStaff.length >0){
            return {status:409,success:false, message: "staff already exists"}
        }
         const inviteToken = inviteStaffToken(email, role)
        const pendingStaff = await db.insert(users).values({
            first_name,
            last_name,
            email,
            is_active: false,
            invite_token: inviteToken,
            phone_number,
            role: role
        }).returning()
         const link = `http://localhost:5000/staff/accept?token=${inviteToken}`
         //sends invite mail 
        await sendInviteEmail(email, first_name, link)
        return{status:200, success:true,message: "staff invited successfully", inviteToken, data:pendingStaff[0]}
    }catch(error){
        console.error("Error inviting staff", error)
        return {status:500, success:false, message: "internal server error"}
    }
}

//ACCEPTS TOKEN AND SETS NEW STAFF PASSWORD
export const acceptInvite =async (password: string, email: string)  =>{
    try{
        const pendingStaff = await db.select().from(users).where(eq(users.email, email))
        if(!pendingStaff){
            return {status:400, success:false, message: "invalid or expired token"}
        }

        const hashed = await bcrypt.hash(password,10)
        const updatedStaff = await db.update(users).set({
            password_hash: hashed,
            is_active: true,
            invite_token: null
        }).where(eq(users.email, email)).returning()

        //sends welcome mail
        const token = accessToken(updatedStaff[0]!.id, updatedStaff[0]!.role! ?? "staff")
        const {password_hash, ...staffData}= updatedStaff[0]!
        return {status:200, success:true ,message: "account activated successfully",token, data:staffData }
    }catch(error){
         console.error("Error inviting staff", error)
        return {status:500, success:false, message: "internal server error"}
    }
}

export const deactivateStaff = async(staffId:number ) =>{
    try{
        const staff = await db.select().from(users).where(eq(users.id,staffId))
        if(!staff.length){
            return {status:404, success: false, message: "Staff not found"}
        }
        await db.update(users).set({is_active: false}).where(eq(users.id, staffId))
        return {status:200, success: true, message: "Staff deactivated successfully"}
    }catch(error){
        console.error("Error deactivating staff", error)
        return {status:500, success: false, message: "Internal server error"}
    }
}


export const assignStaff = async (staffId:number, serviceId:number, businessId:number) =>{
    try{
        const existingStaff = await db.select().from(users).where(and(eq(users.id, staffId), eq(users.role, "staff")))
        if(!existingStaff.length){
            return {status:404, success:false, message: "staff may have been deactivated"}
        }
        const service = await db.select().from(services).where(and(eq(services.id, serviceId), eq(services.business_id, businessId)))
        if(!service.length){
            return {status:404, success:false, message:"service not found"}
        }
        const staffServices = await db.insert(staff_services).values({
            staff_id: staffId,
            service_id: serviceId
        }).returning()
        return {status:200, success:true, message: "Staff assigned to service successfully", data:staffServices[0]}
    }catch(error){
        console.error("Error assigning staff to service", error)
        return {status:500,success: false, message: "Internal server error"}
    }
}

export const getStaffByService = async(serviceId:number ) =>{
    try{
        const staff =  await db.select({
            id:users.id,
            first_name: users.first_name,
            last_name: users.last_name
        }).from(staff_services).innerJoin(users, eq(staff_services.staff_id, users.id))
        .where(eq(staff_services.service_id, serviceId))

        return {status:200, success:true, message: "Staff retrieved successfully", data:staff[0]}
    }catch(error){
        console.error("Error retrieving staff by service", error)
        return {status:500, success:false, message: "Internal server error"}
    }
}

export const setStaffAvailability =async ({staff_id, start_time, end_time}:availabilityEngineInput, day_of_the_week: dayOfTheWeekEnum ) =>{
    try{
        const existingStaff = await db.select().from(users).where(and(eq(users.id, staff_id), eq(users.role, "staff")))
        if(!existingStaff.length){
            return {status:404, success:false ,message: "staff not found"}
        }
        if(existingStaff[0]?.is_active === false){
            return {status:403, success:false, message: "You may have been deactivated , please contact your admin"}
        }
        const existingAvailability = await db.select().from(staff_availability).where(and(eq(staff_availability.staff_id, staff_id), eq(staff_availability.day_of_the_week, day_of_the_week)))
        if(existingAvailability.length >0 ){
            return {status:409, success: false, message: "Availability already set for this day, please update instead"}
        }
        const availability = await db.insert(staff_availability).values({
            staff_id,
            start_time,
            end_time,
            day_of_the_week
        }).returning()
        return{status: 201, success:true, message: "Availabilty created successfully", data:availability[0]}
    }catch(error){
        console.error("Error setting availability;", error)
        return {status:500, success:false, message: "internal server error"}
    }
}

export const updateStaffAvailabity = async({start_time, end_time, staff_id, id }: updateAvailabilityInput, day_of_the_week: dayOfTheWeekEnum) => {
    try{
        const existingStaff = await db.select().from(users).where(and(eq(users.id, staff_id), eq(users.role, "staff")))
        if(!existingStaff.length){
            return{status: 401, success:false , message : "Unauthorized"} 
        }
         if(existingStaff[0]?.is_active === false){
            return {status:403, success:false, message: "You may have been deactivated , please contact your admin"}
        }
        const updatedAvailability = await db.update(staff_availability).set({
            start_time,
            end_time,
            day_of_the_week
        }).where(and(eq(staff_availability.staff_id, staff_id), eq(staff_availability.id, id))).returning()
        return {status:200, success:true, message: "Availability updated successfully", data:updatedAvailability[0]}
    }catch(error){
        console.error("Error updating  staff  availability", error)
        return {status:500, success:false, message: "Internal server error"}
    }
}


export const deleteAllStaff = async()=>{
    try{
        const staff = await db.select().from(users).where(eq(users.role, "staff"))
        if(!staff.length){
            return{status:404, success:false, message: "No staff found"}
        }
        await db.delete(users).where(eq(users.role, "staff"));
        return {status:200, success:true, message: "All staff deleted successfully"}
    }catch(error){
        return{status:500, success:false, message: "internal server error"}
    }
}