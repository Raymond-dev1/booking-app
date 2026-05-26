import {Router} from "express"
const router:Router =Router()

import { authenticate, authorize } from "../middlewares/auth.middleware.js"
import {InviteStaffController ,AcceptInviteController } from "../controllers/staff.controller.js"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

router.post("/invite", authenticate , authorize("owner") , InviteStaffController, )
router.get("/accept", authenticate, authorize("owner"), AcceptInviteController )

export default router;