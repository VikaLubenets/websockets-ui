import DataController from "../../db/dataController";
import { FinishGameResponse } from "../../models/types";

export function finish(winnerId: number, gameId: number): FinishGameResponse{
    const data = DataController.getInstance()
    data.finish(gameId, winnerId);

    return {
        type: "finish",
        data:
            {
                winPlayer: winnerId
            },
        id: 0,
    }

}