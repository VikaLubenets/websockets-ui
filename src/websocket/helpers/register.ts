import DataController from "../../db/dataController";
import { Player, RegRequest, RegResponse } from "../../models/types";

export function register(message: RegRequest, options: Player): RegResponse {
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

    data.setPlayerData(message.data, options);
    return {
        type: "reg",
        data: {
            name: message.data.name,
            index: options.id,
            error: false,
            errorText: ""
        },
        id: 0
    };
}
