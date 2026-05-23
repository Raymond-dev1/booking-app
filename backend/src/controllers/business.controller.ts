import {
  createBusiness,
  getBusinessById,
  getBusinessByName,
  deleteAllBusiness,
  deleteBusinessById
} from "../services/businesses.service.js";

export const CreateBusinessController = async (req: any, res: any) => {
  try {
    const id = req.user.id;
    const { name, business_hours, logo } = req.body;

    const newBusiness = await createBusiness(
      { name, business_hours, logo },
      id,
      
    );
    if (!newBusiness.success) {
      return res.status(newBusiness.status).json(newBusiness);
    }
    return res.status(newBusiness.status).json(newBusiness);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
};

export const GetBusinessById = async (req: any, res: any) => {
  try {
    const id = req.user.id;
    const business = await getBusinessById(id);
    if (!business.success) {
      return res.status(business.status).json(business);
    }
    return res.status(business.status).json(business);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
};

export const GetBusinessByName= async (req: any, res: any) => {
  try {
    const {name} =req.body
    const business = await getBusinessByName(name);
    if (!business.success) {
      return res.status(business.status).json(business);
    }
    return res.status(business.status).json(business);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
};

export const DeleteAllBusiness = async (req: any, res: any) => {
  try {
    const business = await deleteAllBusiness();
    if (!business.success) {
      return res.status(business.status).json(business);
    }
    return res.status(business.status).json(business);
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, success: false, message: "internal server error" });
  }
};
