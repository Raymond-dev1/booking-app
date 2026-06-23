import { Router } from "express";
const router: Router = Router();

import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
    CheckStaffAvailabilityController,
    CreateBookingController
} from "../controllers/booking.controller.js";

router.post("/create", authenticate, authorize("customer","guest","owner","staff"), CreateBookingController)
router.get("/check-avail", authenticate, authorize("guest", "customer", "owner"), CheckStaffAvailabilityController)


export default router;