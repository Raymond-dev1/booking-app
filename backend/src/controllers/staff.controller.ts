import {inviteStaff, acceptInvite} from "../services/staff.service.js"

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

