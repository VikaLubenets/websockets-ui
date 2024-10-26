import WebSocket from 'ws';
import MessageHandler from './messageHandler';
import { Player, WebSocketRequest } from '../models/types';
import { deepJSONParse } from './helpers/deepJSONParse'

export function startWebSocketServer() {
    const PORT = 3000;
    const server = new WebSocket.Server({ port: PORT });
    let nextPlayerId = 0;

    server.on('connection', (ws) => {
        const playerId = nextPlayerId++;

        ws.on('message', (message) => {
            const parsedMessage = deepJSONParse(message.toString()) as unknown as WebSocketRequest;
            let responses;
            if(parsedMessage.type === 'reg'){
                const options = {
                    id: playerId,
                    connection: ws
                };
                responses = MessageHandler(parsedMessage as unknown as WebSocketRequest, playerId, options);
            } else {
                responses = MessageHandler(parsedMessage as unknown as WebSocketRequest, playerId);
            }
            responses.forEach((res) => ws.send(res))
        });

        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    });

    console.log(`WebSocket server is running on ${PORT} port`);
}
