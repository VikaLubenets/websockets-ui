import { WebSocketResponse } from "../../models/types";

export const stringifyResponse = (response: WebSocketResponse) => 
    JSON.stringify({ 
        type: response.type,
        data: JSON.stringify(response.data),
        id: response.id 
    });