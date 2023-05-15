import db from '../database/database.connection.js';
import dayjs from 'dayjs';

export async function getRentals(req,res){
    try{
        const rentals = await db.query(`SELECT rentals.*, customers.* AS customer, games.* AS game
        FROM rentals
        JOIN customers
        ON rentals."customerId" = customers.id
        JOIN games
        ON rentals."gameId" = 1
        `)
        res.send(rentals.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}

export async function postRentals(req,res){
    const {customerId, gameId, daysRented} = req.body
    const rentDate = dayjs().format("YYYY-MM-DD")
    
    try{
        const games = await db.query(`SELECT * FROM games WHERE games.id = $1`, [gameId])
        if(games.rowCount===0) return res.sendStatus(400)
        if(games.rows[0].stockTotal>0) return res.sendStatus(400)
        const originalPrice = daysRented * games.rows[0].pricePerDay
        const sameuser = await db.query(`SELECT * FROM customers WHERE customers.id = $1`, [customerId])
        if(sameuser.rowCount===0) return res.sendStatus(400)

        await db.query(`INSERT INTO rentals (customerId, gameId, daysRented, rentDate, originalPrice) VALUES ($1, $2, $3, $4, $5)`, [customerId, gameId, daysRented, rentDate, originalPrice])
        res.sendStatus(201)
    } catch(err){
        res.status(500).send(err.message)
    }
}

export async function postRentalsById(req,res){
    try{

    } catch(err){
        res.status(500).send(err.message)
    }
}
export async function deleteRentals(req,res){
    try{

    } catch(err){
        res.status(500).send(err.message)
    }
}