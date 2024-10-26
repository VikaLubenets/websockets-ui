import DataController from "../../db/dataController";
import { AddUserToRoomRequest, UpdateRoomResponse } from "../../models/types";
import { updateRoom } from "./updateRoom";

export function addUserToRoom(message: AddUserToRoomRequest, playerId: number): { resAUTR: UpdateRoomResponse, shouldCreateGame: boolean } {
    const data = DataController.getInstance();
    const maxPlayersInOneRoom = 2;

    const player = data.getPlayerById(playerId);
    if (player) {
        data.addUserToRoom(message.data.indexRoom, player);
    }

    const updatedRoom = data.getRoomById(Number(message.data.indexRoom));
    const shouldCreateGame = updatedRoom?.players.length === maxPlayersInOneRoom;
    const resAUTR = updateRoom();

    return { resAUTR, shouldCreateGame };
}
