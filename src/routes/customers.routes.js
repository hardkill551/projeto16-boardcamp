import { Router } from "express";
import { getCustomers, getCustomersById, postCustomers, putCustomersById } from "../controllers/customers.controllers.js";
import { customerSchema } from "../schemas/games.schema.js";
import validateSchema from "../middlewares/validateSchema.middlewares.js";


const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersById)
customerRouter.post("/customers", validateSchema(customerSchema),postCustomers)
customerRouter.put("/customers/:id", validateSchema(customerSchema),putCustomersById)

export default customerRouter