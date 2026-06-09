import {Router} from "express"
const router:Router =Router()

import {CreateServiceController, DeleteServiceController, DeleteAllServicesController} from "../controllers/service.controller.js";
import { authorize, authenticate } from "../middlewares/auth.middleware.js"

router.post("/create", authenticate, authorize("owner"), CreateServiceController)
router.delete("/delete/:serviceId",authenticate, authorize("owner"), DeleteServiceController)
router.delete("/delete", authenticate, authorize("owner"), DeleteAllServicesController)

export default router;