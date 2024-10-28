import DataController from "../../db/dataController";
import { AddShipsRequest } from "../../models/types";

export function addShips(message: AddShipsRequest){
    const data = DataController.getInstance();
    const game = data.addShips(Number(message.data.gameId), Number(message.data.indexPlayer), message.data.ships)

    if (game && game.gameStatus.length === 2) {
        return { shouldStartGame: true };
    } else {
        return { shouldStartGame: false };
    }
}