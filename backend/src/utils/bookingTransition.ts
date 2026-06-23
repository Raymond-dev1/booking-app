import type { bookingStatus } from "../services/booking.service.js"

const validTransitions :Record <bookingStatus , bookingStatus[]> = {
    pending: ["completed", "confirmed", "cancelled"],
    confirmed: ["cancelled","completed"],
    cancelled: [],
    no_show: [],
    completed: []
}

export const transitionStatus =(current: bookingStatus, next: bookingStatus) => {
    if(!validTransitions[current].includes(next)){
        return { status:400, success:false, message: `Cannot transition from ${current} to ${next}`}
    }
    return {status:200, data: next}
}