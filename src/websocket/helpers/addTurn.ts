import DataController from "../../db/dataController";
import { TurnResponse } from "../../models/types";

export function addTurn(gameId: number): TurnResponse {
    const data = DataController.getInstance()
    data.addGameTurn(gameId)
    const game = data.getGameById(gameId)

    return {
        type: "turn",
        data: {
          currentPlayer: game!.turn ?? 0,
        },
        id: 0,
    }

}