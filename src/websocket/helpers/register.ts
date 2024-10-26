import DataController from "../../db/dataController";
import { RegRequest, RegResponse } from "../../models/types";

export function register(message: RegRequest): RegResponse {
    const data = DataController.getInstance();

    if (data.hasPlayer(message.data.name)) {
        return {
            type: "reg",
            data: {
                name: message.data.name,
                index: "",
                error: true,
                errorText: "Player with this name already exists"
            },
            id: 0
        };
    }

    const index = data.setPlayerData(message.data);
    return {
        type: "reg",
        data: {
            name: message.data.name,
            index,
            error: false,
            errorText: ""
        },
        id: 0
    };
}
