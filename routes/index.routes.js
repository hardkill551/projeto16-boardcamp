import { Router } from "express";
import routerGame from "./games.routes.js";
import customerRouter from "./customers.routes.js";




const router = Router()
router.use(routerGame)
router.use(customerRouter)

export default router