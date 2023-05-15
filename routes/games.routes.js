import Router from 'express';
import { getGames, postGames } from '../controllers/games.controllers.js';
import validateGame from '../middlewares/validateSchema.middlewares.js';
import { gamesSchema } from '../schemas/games.schema.js';



const routerGame = Router();

routerGame.get('/games', getGames)
routerGame.post("/games", validateGame(gamesSchema),postGames)

export default routerGame