import {Router} from "express"
const router:Router =Router()

import { authenticate, authorize } from "../middlewares/auth.middleware.js"
import { CreateBusinessController, GetBusinessById, DeleteAllBusiness } from "../controllers/business.controller.js"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

router.post("/register", authenticate , authorize("owner") , CreateBusinessController, )
router.get("/retrieve", authenticate, authorize("owner"), GetBusinessById )
router.delete("/delete-all", authenticate, authorize("owner"), DeleteAllBusiness )

export default router;