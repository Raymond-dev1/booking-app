import { createCustomer } from "../services/auth.service.js";


export const CreateCustomerController =async (req:any, res:any) =>{
    try{
        const{ first_name, last_name, email, password_hash } = req.body

        const newCustomer = await createCustomer({first_name, last_name, email, password: password_hash})
        if(!newCustomer.success){
            return res.status(newCustomer.status).json(newCustomer)
        }
        return res.status(newCustomer.status).json(newCustomer)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}



