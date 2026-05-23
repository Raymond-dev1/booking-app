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
  id: number
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
        slug
      })
      .returning();

    return {
      status: 201,
      success: true,
      message: "Business created successfully",
      data: newBusiness[0],
    };
  } catch (error) {
    console.error("error in creating business", error);
    return { status: 500, success: false, message: "internal sever error" };
  }
};

export const getBusinessById = async (id: number ) => {
  try {
    console.log("looking for business with owner_id:", id)
    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.owner_id, id));

    if (business.length === 0) {
      return { status: 404, success: false, message: "Business not found" };
    }
    return {
      status: 200,
      success: true,
      message: "Business retrieved successfully",
      data:business[0] 
    };
  } catch (error) {
    console.error("Error retrieving business;", error);
    return { status: 500, success: false, message: "internal server error" };
  }
};

export const getBusinessByName= async (name: string ) => {
  try {
    console.log("looking for business with name:", name)
    const business = await db
      .select()
      .from(businesses)
      .where(eq(businesses.name, name));

    if (business.length === 0) {
      return { status: 404, success: false, message: "Business not found" };
    }
    return {
      status: 200,
      success: true,
      message: "Business retrieved successfully",
      data:business[0] 
    };
  } catch (error) {
    console.error("Error retrieving business;", error);
    return { status: 500, success: false, message: "internal server error" };
  }
};

export const deleteBusinessById= async(id: number) => {
  try{
    const business= await db.select().from(businesses).where(eq(businesses.id, id))
    if(business.length === 0){
      return {status:404, success:false, message: "Business not found"}
    }
  }catch(error){
    console.error("Error deleting business, ", error);
    return { status: 500, success: false, message: "internal server error" };
  }
}


export const deleteAllBusiness = async() => {
  try{
    const business= await db.select().from(businesses)
    if(business.length === 0){
      return {status:404, success:false, message: "Business not found"}
    }
      return {
      status: 200,
      success: true,
      message: "Business deleted successfully",
      data:business[0] 
    };
  }catch(error){
    console.error("Error deleting business, ", error);
    return { status: 500, success: false, message: "internal server error" };
  }
}

//logo --external cloud services
//slug --background job