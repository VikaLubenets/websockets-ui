import DataController from "../../db/dataController";
import { StartGameResponse } from "../../models/types";

export function startGame(playerId: number, gameId: number): StartGameResponse {
    const data = DataController.getInstance();
    const game = data.getGameById(gameId)
    const playerData = game?.gameStatus.find((status) => status.indexPlayer === playerId)

    return {
            type: "start_game",
            data:
                {
                    ships: playerData?.ships ?? [],
                    currentPlayerIndex: playerData?.indexPlayer ?? 0
                },
            id: 0,
        }
}