import {Router} from "express"
const router:Router =Router()

// import { authenticate, authorize } from "../middlewares/auth.middleware.js"
import { CreateUserController, LoginUserController, GetUserController} from "../controllers/auth.controller.js"

router.post("/register", CreateUserController, )
router.post("/login", LoginUserController)
router.get("/get/:id",GetUserController)


export default router;