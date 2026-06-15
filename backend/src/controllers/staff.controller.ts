import { dayOfTheWeekEnum } from "../db/schema.js"
import {inviteStaff, acceptInvite, deleteAllStaff, deactivateStaff, assignStaff, getStaffByService, updateStaffAvailabity} from "../services/staff.service.js"
import { setStaffAvailability } from "../services/staff.service.js"

export const InviteStaffController =async (req:any, res:any) =>{
    try{
        const {email, first_name, last_name, phone_number} = req.body
        const role= "staff"

        const pendingStaff = await inviteStaff({email, first_name,last_name, phone_number}, role)
        if(!pendingStaff.success){
            return res.status(pendingStaff.status).json(pendingStaff)
        }
        return res.status(pendingStaff.status).json(pendingStaff)
    }catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
}

export const AcceptInviteController = async(req:any, res:any) =>{
    try{
        const {password} =req.body
        const email  = req.inviteEmail

        const result = await acceptInvite(password , email )
         if(!result.success){
            return res.status(result.status).json(result)
        }
        return res.status(result.status).json(result)
    }catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
}

export const AssignStaffController = async(req:any, res:any) => {
    try{
        const serviceId =req.params.serviceId
        const {staffId, businessId }= req.body

        const result  = await assignStaff(staffId, serviceId, businessId)
        if(!result.success){
            return res.status(result.status).json(result)
        }
        return res.status(result.status).json(result)
    }catch(error){
         return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
}
}

export const GetStaffByServiceController = async(req:any, res:any) =>{
    try{
        const serviceId = req.params.serviceId
        const staff = await getStaffByService(serviceId)
        if(!staff.success){
            return res.status(staff.status).json(staff)
        }
        return res.status(staff.status).json(staff)
    }catch(error){
         return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
    }
}

export const DeactivateStaffController =async(req:any, res:any)=>{
    try{
        const id = req.params.id
        const result = await deactivateStaff(id)
        if(!result.success){
            return res.status(result.status).json(result)
        }
        return res.status(result.status).json(result)
    }catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
}

export const SetStaffAvailController = async(req:any, res:any)=>{
    try{
        const staff_id =req.user.id
        const{ start_time, end_time, day_of_the_week } = req.body
        const result = await setStaffAvailability({start_time, staff_id,end_time}, day_of_the_week)
        if(!result.success){
            return res.status(result.status).json(result)
        }
        return res.status(result.status).json(result)
    }catch(error){
        console.error("Error in create service controller", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}
export const updateStaffAvailController = async(req:any, res:any) =>{
    try{
        const staff_id =req.user.id
        const id = req.params.availId
        const {start_time, end_time, day_of_the_week} =req.body
        const result = await updateStaffAvailabity({start_time, end_time,staff_id, id}, day_of_the_week)
         if(!result.success){
            return res.status(result.status).json(result)
        }
        return res.status(result.status).json(result)
    }catch(error){
        console.error("Error in create service controller", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const DeleteAllStaffController = async(req:any, res:any) =>{
    try{
        const staff = await deleteAllStaff()
         if(!staff.success){
            return res.status(staff.status).json(staff)
        }
        return res.status(staff.status).json(staff)
    }catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
}