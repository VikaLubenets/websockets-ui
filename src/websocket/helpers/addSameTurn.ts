import DataController from "../../db/dataController";
import { TurnResponse } from "../../models/types";

export function addSameTurn(gameId: number): TurnResponse {
    const data = DataController.getInstance()
    data.addSameTurn(gameId)
    const game = data.getGameById(gameId)

    return {
        type: "turn",
        data: {
          currentPlayer: game!.turn ?? 0,
        },
        id: 0,
    }

}