import {Router} from "express"
const router:Router =Router()

import {CreateServiceController, DeleteServiceController} from "../controllers/service.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js"

router.post("/create",authorize("owner") ,CreateServiceController, )
router.delete("/delete/:serviceId",authorize("owner") ,DeleteServiceController)

export default router;