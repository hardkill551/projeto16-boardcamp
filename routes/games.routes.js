import Router from 'express';
import { getGames, postGames } from '../controllers/games.controllers.js';
import { gamesSchema } from '../schemas/games.schema.js';
import validateSchema from '../middlewares/validateSchema.middlewares.js';



const routerGame = Router();

routerGame.get('/games', getGames)
routerGame.post("/games", validateSchema(gamesSchema),postGames)

export default routerGame