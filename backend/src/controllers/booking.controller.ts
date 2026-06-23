import { checkStaffAvailability, confirmBooking, createBooking } from "../services/booking.service.js";

export const CheckStaffAvailabilityController =async(req:any, res:any) => {
    try{
        const {staff_id, service_id, day_of_the_week} = req.body
        const staffAvail = await checkStaffAvailability({staff_id, service_id}, day_of_the_week)

        if(!staffAvail.success){
            return res.status(staffAvail.status).json(staffAvail)
        }
        return res.status(staffAvail.status).json(staffAvail)
    }catch(error){
        console.error("Error in booking controller", error)
        return res.status(500).json({status:500,success:false, message: "internal server error"})
    }
}

export const CreateBookingController = async(req: any, res:any) => {
    try{
        const customer_id = req.user.id
        const idempotency_key = req.headers["Idempotency-Key"];
        const { business_id, service_id, staff_id, start_time, end_time, date,status } =req.body
        
        const newBooking = await createBooking({ business_id, service_id, staff_id, customer_id, start_time, end_time, idempotency_key, date},  status )
        if(!newBooking.success){
            return res.status(newBooking.status).json(newBooking)
        }
        return res.status(newBooking.status).json(newBooking)
    }catch(error){
        console.error("Error in booking controller", error)
        return res.status(500).json({status:500,success:false, message: "internal server error"})
    }
}

export const ConfirmBookingController = async (req:any, res:any) =>{
    try{
        const staff_id = req.user.id
        const {booking_id}= req.body

        const booking= await confirmBooking({staff_id}, booking_id)
        if(!booking!.success){
            return res.status(booking!.status).json(booking)
        }
        return res.status(booking!.status).json(booking)
    }catch(error){
        console.error("Error in confirm booking controller", error)
        return res.status(500).json({status:500,success:false, message: "internal server error"})
    }
}