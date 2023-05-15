import { Router } from "express";
import routerGame from "./games.routes.js";




const router = Router()
router.use(routerGame)

export default router