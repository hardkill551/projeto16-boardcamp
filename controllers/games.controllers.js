import db from '../database/database.connection.js';

export async function getGames(req, res) {
    try{
        const games = await db.query("SELECT * FROM games");
        if(!games){
            res.status(404).send("Games not found")
            
        }
        return res.send(games.rows)
    }catch(err){
        res.status(500).send(err.message)
    }
    
}

export async function postGames(req, res) {
    const {name, image, stockTotal, pricePerDay} = req.body
    try {
        const sameName = await db.query(`SELECT games.name FROM games WHERE games.name = $1`, [name])
        if(sameName.rowCount !== 0){
            return res.sendStatus(409)
        }
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4)`,[name, image, stockTotal, pricePerDay])
        res.sendStatus(201)
    }catch(err){
        res.status(500).send(err.message)
    }
}