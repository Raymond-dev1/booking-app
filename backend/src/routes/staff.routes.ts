import {Router} from "express"
const router:Router =Router()

import { authenticate, authorize , authenticateInviteLink} from "../middlewares/auth.middleware.js"
import {InviteStaffController ,AcceptInviteController, DeleteAllStaffController} from "../controllers/staff.controller.js"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

router.post("/invite", authenticate , authorize("owner") , InviteStaffController, )
router.post("/accept", authenticateInviteLink, AcceptInviteController )
router.delete("/delete", authenticate, authorize("owner"), DeleteAllStaffController)

export default router;