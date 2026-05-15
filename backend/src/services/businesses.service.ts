import {
  businesses,
  services,
  staff_availability,
  staff_services,
  bookings,
} from "../db/schema.js";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";

type BusinessInput = {
  name: string;
  business_hours: JSON;
  logo: string;
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const createBusiness = async (
  { name, business_hours, logo }: BusinessInput,
  id: number,
) => {
  try {
    const existingBusiness = await db
      .select()
      .from(businesses)
      .where(eq(businesses.owner_id, id));
    if (existingBusiness.length > 0) {
      return {
        status: 409,
        success: false,
        message: "Multiple business not supported yet ",
      };
    }

    const slug = generateSlug(name);
    const existingSlug = await db     
      .select()
      .from(businesses)
      .where(eq(businesses.slug, slug));
    if (existingSlug.length > 0) {
      return {
        status: 409,
        success: false,
        message: "Business name already taken",
      };
    }

    const newBusiness = await db
      .insert(businesses)
      .values({
        name,
        business_hours,
        logo,
        owner_id: id,
      })
      .returning();

    return {
      status: 201,
      success: true,
      message: "Business created successfully",
      data: newBusiness,
    };
  } catch (error) {
    console.error("error in creating business", error);
    return { status: 500, success: false, message: "internal sever error" };
  }
};

//logo --external cloud services
//slug --background job
