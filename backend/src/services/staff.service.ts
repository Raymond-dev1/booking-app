import {accessToken, inviteStaffToken} from "./token.service.js";
import { db } from "../db/index.js";
import {eq} from "drizzle-orm"
import { users , services, staff_availability, staff_services} from "../db/schema.js";
import bcrypt from "bcrypt"
import {sendInviteEmail} from "../services/mail.service.js"

type CreateStaffInput = {
    first_name: string,
    last_name: string,
    email: string,
    phone_number :string
}
type role=  "staff"

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