import DataController from "../../db/dataController";
import { CreateGameResponse } from "../../models/types";

export function createGame(roomId: number, playerId: number): CreateGameResponse {
    const data = DataController.getInstance();
    const room = data.createGame(roomId)

    return {
        type: "create_game",
        data:
            {
                idGame: Number(room!.gameId),  
                idPlayer: playerId,
            },
        id: 0,
    }

}