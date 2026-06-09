import {createService, deleteAllService, deleteService} from "../services/services.service.js"; 

export const CreateServiceController = async (req:any, res:any) => {
    try{
        const userId =req.user.id
        const {name, duration_minutes, buffer_mins, price, description, payment_type} = req.body

        const newService = await createService({name, duration_minutes, buffer_mins, price, description}, userId, payment_type)
        if(!newService.success){
            return res.status(newService.status).json(newService)
        }
        return res.status(newService.status).json(newService)
    }catch(error){
        console.error("Error in create service controller", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const DeleteServiceController = async (req:any, res:any) => {
    try{
        const serviceId =parseInt(req.params.serviceId)
        const service = await deleteService(serviceId)
        
        if(!service.success){
            return res.status(service.status).json(service)
        }
        return res.status(service.status).json(service)
    }catch(error){
        console.error("Error in delete service controller", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const DeleteAllServicesController = async (req:any, res:any) => {
    try{
        const service = await deleteAllService()
        if(!service.success){
            return res.status(service.status).json(service)
        }
        return res.status(service.status).json(service)
    }catch(error){
        console.error("Error in delete service controller", error)
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}