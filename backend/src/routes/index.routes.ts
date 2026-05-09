import authRoutes from "./auth.routes.js"
import {Router} from "express"
import dotenv from 'dotenv'

dotenv.config()

const router: Router = Router() 

router.use("/auth", authRoutes)

export default router