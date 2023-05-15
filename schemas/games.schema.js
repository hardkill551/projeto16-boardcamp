import joi from "joi"


export const gamesSchema = joi.object({
    name:joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().min(1).required(),
    pricePerDay: joi.number().min(1).required()
})

export const customerSchema = joi.object({
    name:joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().min(11).max(11).required(),
    birthday: joi.string().required()
})