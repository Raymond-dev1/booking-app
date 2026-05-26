import {Router} from "express"
import dotenv from 'dotenv'
import authRoutes from "./auth.routes.js"
import businessroutes from "./business.routes.js"
import staffRoutes from "./staff.routes.js"

dotenv.config()

const router: Router = Router() 

router.use("/auth", authRoutes)
router.use("/business", businessroutes)
router.use("/staff", staffRoutes)

export default router