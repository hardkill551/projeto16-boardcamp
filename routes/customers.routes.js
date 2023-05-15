import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers } from "../controllers/customers.controllers.js";
import { customerSchema } from "../schemas/games.schema.js";
import validateSchema from "../middlewares/validateSchema.middlewares.js";


const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersById)
customerRouter.post("/customers", validateSchema(customerSchema),postCustomers)

export default customerRouter