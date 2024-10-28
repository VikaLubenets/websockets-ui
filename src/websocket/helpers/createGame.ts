import DataController from "../../db/dataController";
import { CreateGameResponse } from "../../models/types";

export function createGame(roomId: number, playerId: number): CreateGameResponse {
    const data = DataController.getInstance();
    const room = data.getRoomById(roomId);

    if (room && room.gameId === null) { 
        data.createGame(roomId)
    }

    const roomUpd = data.getRoomById(roomId);

    return {
        type: "create_game",
        data:
            {
                idGame: Number(roomUpd!.gameId),  
                idPlayer: playerId,
            },
        id: 0,
    }

}
    