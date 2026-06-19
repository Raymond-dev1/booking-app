import { eq, and } from "drizzle-orm";
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

interface availabilityEngineInput {
  serviceId: number;
  staff_id: number;
  end_time: number;
  start_time: number;
}

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
  { staff_id, serviceId }: availabilityEngineInput,
  day_of_the_week: dayOfTheWeekEnum,
) => {
  try {
    const service = await db
      .select()
      .from(services)
      .where(and(eq(services.id, serviceId)));
    if (!service.length) {
      return { status: 404, success: false, message: "service not found" };
    }
    const { duration_minutes, buffer_mins } = service[0]!;
    const slotDuration = (duration_minutes ?? 60) + (buffer_mins ?? 0);

    const staffList = await getStaffByService(serviceId);

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

        //Yet to implement..
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
    return { status: 200, succes: true, message: mergedSlot };
  } catch (error) {
    console.error("Error checking staff availability;", error);
    return { status: 500, success: false, message: "internal server error" };
  }
};

