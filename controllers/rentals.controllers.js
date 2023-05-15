import db from '../database/database.connection.js';
import dayjs from 'dayjs';

export async function getRentals(req,res){
    try{
        const rentals = await db.query(`SELECT rentals.*, customers.* AS customer, games.* AS game
        FROM rentals
        JOIN customers
        ON rentals."customerId" = customers.id
        JOIN games
        ON rentals."gameId" = games.id
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
        const rentalsGames = await db.query(`SELECT * FROM rentals JOIN games ON rentals."gameId" = $1 WHERE rentals."gameId" = games.id`, [gameId])
        if(games.rows[0].stockTotal<rentalsGames.rowCount) return res.sendStatus(400)
        const originalPrice = daysRented * games.rows[0].pricePerDay
        const sameuser = await db.query(`SELECT * FROM customers WHERE customers.id = $1`, [customerId])
        if(sameuser.rowCount===0) return res.sendStatus(400)

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice") VALUES ($1, $2, $3, $4, $5)`, [customerId, gameId, daysRented, rentDate, originalPrice])
        res.sendStatus(201)
    } catch(err){
        res.status(500).send(err.message)
    }
}

export async function postRentalsById(req,res){
    const {id} = req.params
    const returnDate = dayjs().format("YYYY-MM-DD")
    try{
        const games = await db.query(`SELECT games."pricePerDay", rentals."rentDate", rentals."daysRented" FROM rentals JOIN games ON games.id = rentals."gameId" WHERE rentals.id = $1`, [id])
        const nowDate = Date.parse(dayjs())/86400000
        const rentDate = Date.parse(games.rows[0].rentDate)/86400000
        const rentDays =  nowDate-rentDate
        const delay = games.rows[0].daysRented-rentDays
        const delayFee = null
        if(delay>=1) delayFee = games.rows[0].pricePerDay*(delay)
        const rent = await db.query("SELECT * FROM rentals WHERE rentals.id = $1", [id])
        if(rent.rowCount === 0) return res.sendStatus(404)
        if(rent.rows[0].returnDate!==null) return res.sendStatus(400)
        await db.query("UPDATE rentals SET returnDate = $1, delayFee = $2 WHERE rentals.id = $3",[returnDate, delayFee,id])
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