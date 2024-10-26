import DataController from "../../db/dataController";
import { UpdateRoomResponse } from "../../models/types";

export function updateRoom(): UpdateRoomResponse {
    const data = DataController.getInstance();
    const rooms = data.getAllRooms().map((room, index) => ({
        roomId: index,
        roomUsers: room.players.map(player => ({
            name: player.name,
            index: player.id
        }))
    }));

    return {
        type: "update_room",
        data: rooms,
        id: 0,
    }
}