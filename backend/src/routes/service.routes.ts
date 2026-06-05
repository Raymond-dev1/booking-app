import {Router} from "express"
const router:Router =Router()

import {CreateServiceController, DeleteServiceController, DeleteAllServicesController} from "../controllers/service.controller.js";
import { authorize } from "../middlewares/auth.middleware.js"

router.post("/create",authorize("owner") ,CreateServiceController, )
router.delete("/delete/:serviceId",authorize("owner") ,DeleteServiceController)
router.delete("/delete",authorize("owner"), DeleteAllServicesController)

export default router;