import { eq, and, sql, inArray, lt, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  users,
  services,
  businesses,
  staff_availability,
  staff_services,
  bookings,
} from "../db/schema.js";
import { getStaffByService } from "./staff.service.js";
import { addMinutes } from "../utils/time.js";
import { transitionStatus } from "../utils/bookingTransition.js";

interface availabilityEngineInput {
  service_id: number;
  staff_id: number;
}

interface BookingInput{
  business_id:number;
   service_id:number;
    staff_id:number;
     customer_id:number;
     start_time:string;
      end_time:string;
     idempotency_key: string;
     date:string;
}

export type bookingStatus = 
 | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"


  type paymentStatus =
 | "unpaid"
  | "paid"
  | "refunded"

type dayOfTheWeekEnum =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

type StaffItem = {
  id: number;
  first_name: string | null;
  last_name: string | null;
};

//GENERATES FREE SLOTS
const generateFreeSlots = (
  workStart: string,
  workEnd: string,
  slotDuration: number,
  existingBookings: any[],
  staffId: number,
) => {
  let slots = [];
  let current = workStart;

  while (current < workEnd) {
    const slotEnd = addMinutes(current, slotDuration);
    if (slotEnd > workEnd) break;

    const isBooked = existingBookings.some(
      (booking) => booking.start_time < slotEnd && booking.end_time > current,
    );
    if (!isBooked) {
      slots.push({ staffId, startTime: current, endTime: slotEnd });
    }
    current = addMinutes(current, slotDuration);
  }
  return slots;
};

/**
 * 
QUERIES SERVICE TABLE , GETS STAFF BY SERVICE , AVAILABILITY TABLE AND A BOOKINGS TABLE,
TO PARSE DATA FOR SLOTS GENERATION

 */

export const checkStaffAvailability = async (
  { staff_id, service_id }: availabilityEngineInput,
  day_of_the_week: dayOfTheWeekEnum,
) => {
  try {
    const service = await db
      .select()
      .from(services)
      .where(and(eq(services.id, service_id)));
    if (!service.length) {
      return { status: 404, success: false, message: "service not found" };
    }
    const { duration_minutes, buffer_mins } = service[0]!;
    const slotDuration = (duration_minutes ?? 60) + (buffer_mins ?? 0);

    const staffList = await getStaffByService(service_id);

    const allSlots = await Promise.all(
      staffList.data!.map(async (staff: StaffItem) => {
        const availability = await db
          .select()
          .from(staff_availability)
          .where(
            and(
              eq(staff_availability.staff_id, staff_id),
              eq(staff_availability.day_of_the_week, day_of_the_week),
            ),
          );
        if (!availability.length) return [];

        const { start_time: workStart, end_time: workEnd } = availability[0]!;

        const existingBookings = await db
          .select()
          .from(bookings)
          .where(
            and(
              eq(bookings.staff_id, staff_id),
              eq(bookings.status, "confirmed"),
            ),
          );

        return generateFreeSlots(
          workStart,
          workEnd,
          slotDuration,
          existingBookings,
          staff.id,
        );
      }),
    );

    const mergedSlot = allSlots
      .flat()
      .sort((a, b) => a.startTime.localeCompare(b.endTime));
    return { status: 200, succes: true, data: mergedSlot };
  } catch (error) {
    console.error("Error checking staff availability;", error);
    return { status: 500, success: false, message: "internal server error" };
  }
};



export const  createBooking = async({ business_id, service_id, staff_id, customer_id, start_time, end_time, idempotency_key, date}:BookingInput, status: bookingStatus) =>{
  try{
    return await db.transaction(async(tx) => {
    const [existing] = await tx.select().from(bookings).where(eq(bookings.idempotency_key, idempotency_key))
    if(existing)
      return {status: 200, success:true, data: existing}

    // PESSIMISTIC LOCKING -the 'FOR UPDATE' locks until transaction commits
    await tx.execute(sql`
      SELECT id FROM bookings
      WHERE staff_id = ${staff_id}
      AND status IN ('pending', 'confirmed')
      AND start_time< ${end_time}
      AND end_time > ${start_time}
      FOR UPDATE
      `)

      const overlap = await tx.select().from(bookings)
      .where(and(
        eq(bookings.staff_id, staff_id),
        inArray(bookings.status, ["pending", "confirmed"]),
        lt(bookings.start_time , end_time),
        gt(bookings.end_time , start_time)
      ))

      if(overlap.length) {
        return {status:409, success:false, message: "slot already booked"}
      }

    
      const [newBooking] = await tx.insert(bookings).values({
        business_id,
        service_id,
        staff_id,
        customer_id,
        start_time,
        end_time,
        status: "pending",
        idempotency_key,
        date,
      }).returning()

      return{status:201, success: true , message: " Booking successfully created", data: newBooking}

    })
  }catch(error:any){
    console.error("Error creating booking", error)
    return{status:500, success:false, message : "internal server error"}
  }
}


export const confirmBooking = async ( {staff_id}:Partial<BookingInput>, booking_id: number ) => {
  try{
    const confirmedBooking = await db.select().from(bookings).where(and(eq(bookings.id, booking_id), eq(bookings.status, "confirmed")))
    if(confirmedBooking.length){
      return {status:409, success:false, message : "Booking already confirmed"}
    }
    const current :bookingStatus= "pending";
    const next: bookingStatus = "confirmed";

    const result =  transitionStatus( current, next)
    if(result.success)
      return;
    
    const confirmBooking = await db.update(bookings).set({
      status: "confirmed",
    }).where(and(eq(bookings.staff_id, staff_id!), eq(bookings.id , booking_id))).returning()
    
    return {status:200, success: true, message: "Booking successfully confirmed", data: confirmBooking}
  }catch(error){
    console.error("Error confirming booking", error)
   return {status:500, success:false, message: "Internal server error"}
  }
}
