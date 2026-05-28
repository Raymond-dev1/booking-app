import {inviteStaff, acceptInvite, deleteAllStaff} from "../services/staff.service.js"

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