import db from '../src/database/database.connection.js';
import dayjs from 'dayjs';

export async function getRentals(req,res){
    try{
        const rentals = await db.query(`SELECT rentals.*, customers.id AS "idCustomer", customers.name AS "nameCustomer", games.id AS "idGame", games.name AS "nameGame"
        FROM rentals
        JOIN customers
        ON rentals."customerId" = customers.id
        JOIN games
        ON rentals."gameId" = games.id
        `)
        const x = rentals.rows.map((o)=>({
            ...o, customer:{
                id:o.idCustomer,
                name:o.nameCustomer
            },
            game:{
                id:o.idGame,
                name:o.nameGame
            }
        }))
        x.map((o)=>{
            delete o.nameCustomer
            delete o.idCustomer
            delete o.idGame
            delete  o.nameGame
        })
        
 
        res.send(x)
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
        if(games.rows[0].stockTotal<=rentalsGames.rowCount) return res.sendStatus(400)
        
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
        const rent = await db.query("SELECT * FROM rentals WHERE rentals.id = $1", [id])
        if(rent.rowCount === 0) return res.sendStatus(404)
        const games = await db.query(`SELECT games."pricePerDay", rentals."rentDate", rentals."daysRented" FROM rentals JOIN games ON games.id = rentals."gameId" WHERE rentals.id = $1`, [id])
        const nowDate = Date.parse(dayjs())/86400000
        const rentDate = Date.parse(games.rows[0].rentDate)/86400000
        const rentDays =  nowDate-rentDate

        if(rent.rows[0].returnDate!==null) return res.sendStatus(400)
        let delay;
        if(games.rows[0].daysRented<rentDays) {
            delay = rentDays-games.rows[0].daysRented
            const delayFee = games.rows[0].pricePerDay*(Math.floor(delay))
            await db.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE rentals.id = $3`,[returnDate, delayFee,id])
            return res.sendStatus(200)
        }
        
        await db.query(`UPDATE rentals SET "returnDate" = $1 WHERE rentals.id = $2`,[returnDate, id])
        res.sendStatus(200)
        
    } catch(err){
        res.status(500).send(err.message)
    }
}
export async function deleteRentals(req,res){
    const {id} = req.params
    console.log(id)
    try{
        
        const verify = await db.query(`SELECT rentals.id, rentals."returnDate" FROM rentals WHERE rentals.id = $1`, [id])
        if(verify.rowCount===0) return res.sendStatus(404)
        if(verify.rows[0].returnDate === null) return res.sendStatus(400)
        await db.query("DELETE FROM rentals WHERE rentals.id = $1", [id])
        res.sendStatus(200)
    } catch(err){ 
        res.status(500).send(err.message)
    }
}