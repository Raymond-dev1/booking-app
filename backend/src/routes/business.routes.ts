import {Router} from "express"
const router:Router =Router()

import { authenticate, authorize } from "../middlewares/auth.middleware.js"
import { CreateBusinessController, GetBusinessById } from "../controllers/business.controller.js"


router.post("/register", authenticate , authorize("owner") , CreateBusinessController, )
router.post("/retrieve", authenticate, authorize("owner"), GetBusinessById )

export default router;