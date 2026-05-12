import { createCustomer, getCustomerById, loginCustomer } from "../services/auth.service.js";


export const CreateCustomerController =async (req:any, res:any) =>{
    try{
        const{ first_name, last_name, email, password } = req.body

        const newCustomer = await createCustomer({first_name, last_name, email, password})
        if(!newCustomer.success){
            return res.status(newCustomer.status).json(newCustomer)
        }
        return res.status(newCustomer.status).json(newCustomer)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const LoginCustomerController = async (req:any, res:any) => {
    try{
        const {email, password} = req.body

        const customer = await loginCustomer({email, password})
        if(!customer.success){
            return res.status(customer.status).json(customer)
        }
        return res.status(customer.status).json(customer)
    }catch(error){
        console.error("Error in login controller;", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const  GetCustomerController = async (req:any, res:any) =>{
    try{
        const id = req.user.id
        const customer =await getCustomerById(id)
        if(!customer.success){
            return res.status(customer.status).json(customer)
        }
        return res.status(customer.status).json(customer)
    }catch(error){
        console.error("Error in fetch customer controller", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}


