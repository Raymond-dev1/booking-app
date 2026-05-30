import {Router} from "express"
const router:Router =Router()

import { authenticate, authorize , authenticateInviteLink} from "../middlewares/auth.middleware.js"
import {InviteStaffController ,AcceptInviteController, DeleteAllStaffController, DeactivateStaffController, AssignStaffController, GetStaffByServiceController} from "../controllers/staff.controller.js"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

router.post("/invite", authenticate , authorize("owner") , InviteStaffController, )
router.post("/accept", authenticateInviteLink, AcceptInviteController )
router.delete("/delete", authenticate, authorize("owner"), DeleteAllStaffController)
router.post("/deactivate/:id", authenticate, authorize("owner"), DeactivateStaffController)
router.post("/assign/:serviceId", authenticate, authorize("owner"), AssignStaffController)
router.get("/:serviceId", authenticate, authorize("owner"), GetStaffByServiceController)

export default router;