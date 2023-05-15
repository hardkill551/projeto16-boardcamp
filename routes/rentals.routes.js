import { Router } from "express";
import { deleteRentals, getRentals, postRentals, postRentalsById } from "../controllers/rentals.controllers.js";
import validateSchema from "../middlewares/validateSchema.middlewares.js";
import { rentalSchema } from "../schemas/games.schema.js";



const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(rentalSchema),postRentals)
rentalsRouter.post("/rentals/:id/return", postRentalsById)
rentalsRouter.delete("/rentals/:id", deleteRentals)

export default rentalsRouter