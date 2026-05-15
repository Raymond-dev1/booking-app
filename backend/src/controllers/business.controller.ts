import { createBusiness } from "../services/businesses.service.js";

export const CreateBusinessController = async( req: any, res :any) =>{
    try{
        const id = req.user.id
        const {name, business_hours, logo } = req.body

        const newBusiness = await createBusiness({ name, business_hours, logo }, id)
        if(!newBusiness.success){
            return res.status(newBusiness.status).json(newBusiness)
        }
        return res.status(newBusiness.status).json(newBusiness)
    }catch(error){
        return res.status(500).json({status:500, success:false , message : "internal sever error"})
    }
}