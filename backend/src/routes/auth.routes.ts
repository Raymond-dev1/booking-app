import {Router} from "express"
const router:Router =Router()

import { authenticate, authorize } from "../middlewares/auth.middleware.js"
import { CreateCustomerController } from "../controllers/auth.controller.js"

router.post("/register-customer", authenticate, authorize("customer"), CreateCustomerController, )

export default router;