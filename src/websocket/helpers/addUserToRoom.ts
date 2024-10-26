import DataController from "../../db/dataController";
import { AddUserToRoomRequest, UpdateRoomResponse } from "../../models/types";
import { updateRoom } from "./updateRoom";

export function addUserToRoom(message: AddUserToRoomRequest, playerId: number): UpdateRoomResponse {
    const data = DataController.getInstance();
    const player = data.getPlayerById(playerId);
    if(player){
        data.addUserToRoom(message.data.indexRoom, player)
    }

    return updateRoom()
}