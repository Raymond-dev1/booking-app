import { createUser, getUserById, loginUser } from "../services/auth.service.js";


export const CreateUserController =async (req:any, res:any) =>{
    try{
        const{ first_name, last_name, email, password, role } = req.body

        const newUser = await createUser({first_name, last_name, email, password}, role)
        if(!newUser.success){
            return res.status(newUser.status).json(newUser)
        }
        return res.status(newUser.status).json(newUser)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const LoginUserController = async (req:any, res:any) => {
    try{
        const {email, password} = req.body

        const customer = await loginUser({email, password})
        if(!customer.success){
            return res.status(customer.status).json(customer)
        }
        return res.status(customer.status).json(customer)
    }catch(error){
        console.error("Error in login controller;", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const  GetUserController = async (req:any, res:any) =>{
    try{
        const id = req.user.id
        const user =await getUserById(id)
        if(!user.success){
            return res.status(user.status).json(user)
        }
        return res.status(user.status).json(user)
    }catch(error){
        console.error("Error in fetch user controller", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}


