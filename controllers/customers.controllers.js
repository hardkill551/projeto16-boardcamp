import db from '../database/database.connection.js';
import dayjs from "dayjs"
export async function getCustomers(req,res){
    try{
        const customers = await db.query(`SELECT * FROM customers`)
        customers.rows = customers.rows.map((o)=> ({
            ...o,
            birthday: new Date(o.birthday).toISOString().split("T")[0]

        }))
        res.send(customers.rows)
    }catch (err)
    {
        res.status(500).send(err.message)
    }
}

export async function postCustomers(req, res){
    const {name, phone, cpf, birthday} = req.body
    const test = dayjs(birthday).format("YYYY-MM-DD")
    if(test==="Invalid Date"){
        return res.sendStatus(400)
    }
    if(isNaN(cpf)) return res.sendStatus(400)
    try{
        const sameCpf = await db.query(`SELECT * FROM customers WHERE customers.cpf = $1`, [cpf])
        if(sameCpf.rowCount!==0){
            return res.sendStatus(409)
        }
        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday])
        res.sendStatus(201)
    }catch(err){
        res.status(500).send(err.message)
    }
}

export async function getCustomersById(req,res){
    const {id} = req.params
    
    try{
        const user = await db.query("SELECT * FROM customers WHERE customers.id = $1",[id])
        if(user.rowCount===0) return res.sendStatus(404)
        user.rows = user.rows.map((o)=> ({
            ...o,
            birthday: new Date(o.birthday).toISOString().split("T")[0]

        }))
        res.send(user.rows[0])
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export async function putCustomersById(req,res){
    const {id} = req.params
    const {name, phone, cpf, birthday} = req.body
    const test = dayjs(birthday).format("YYYY-MM-DD")
    if(test==="Invalid Date"){
        return res.sendStatus(400)
    }
    try{
        const user = await db.query("SELECT * FROM customers WHERE customers.id = $1", [id])
        const sameUser = await db.query("SELECT * FROM customers WHERE customers.cpf = $1", [cpf])
        if(sameUser.rowCount !== 0 && user.rows.id!==sameUser.rows.id) return res.sendStatus(409)
        await db.query("UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE customers.id = $5",[name, phone, cpf, birthday, id])
        res.sendStatus(201)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}