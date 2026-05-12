import {Router} from "express"
const router:Router =Router()

// import { authenticate, authorize } from "../middlewares/auth.middleware.js"
import { CreateCustomerController,LoginCustomerController ,GetCustomerController} from "../controllers/auth.controller.js"

router.post("/register-customer", CreateCustomerController, )
router.post("/login-customer", LoginCustomerController)
router.get("/get-customer/:id",GetCustomerController)


export default router;