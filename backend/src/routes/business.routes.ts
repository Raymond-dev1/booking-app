import {Router} from "express"
const router:Router =Router()

import { authenticate, authorize } from "../middlewares/auth.middleware.js"
import { CreateBusinessController } from "../controllers/business.controller.js"


router.post("/register", authenticate , authorize("owner") , CreateBusinessController, )


export default router;