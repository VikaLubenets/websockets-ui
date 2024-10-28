import DataController from "../../db/dataController";
import { UpdateWinnersResponse } from "../../models/types";

export function updateWinners(): UpdateWinnersResponse {
    const data = DataController.getInstance();
    const players = data.getAllPlayers().map((player) => ({name: player.name, wins: player.wins}));

    return {
        type: "update_winners",
        data: players,
        id: 0,
    };
}
