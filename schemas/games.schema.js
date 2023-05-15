import joi from "joi"

export const gamesSchema = joi.object({
    name:joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().min(0).required(),
    pricePerDay: joi.number().min(0).required()
})