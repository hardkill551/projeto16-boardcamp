import db from '../database/database.connection.js';

export async function getRentals(req,res){
    try{
        const rentals = await db.query(`SELECT rentals.*, customers.* AS customer, game.* AS games
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
    try{

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