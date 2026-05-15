import {Router} from "express"
import dotenv from 'dotenv'
import authRoutes from "./auth.routes.js"
import businessroutes from "./business.routes.js"

dotenv.config()

const router: Router = Router() 

router.use("/auth", authRoutes)
router.use("/business", businessroutes)

export default router