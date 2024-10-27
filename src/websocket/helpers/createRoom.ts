import DataController from "../../db/dataController";
import { CreateRoomRequest, UpdateRoomResponse } from "../../models/types";
import { updateRoom } from "./updateRoom";

export function createRoom(message: CreateRoomRequest, playerId: number): UpdateRoomResponse {
    const data = DataController.getInstance();
    const player = data.getPlayerById(playerId);
    if(player){
        data.addRoom(player)
    }
    return updateRoom()
}


