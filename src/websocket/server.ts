import WebSocket from 'ws';
import MessageHandler from './messageHandler';
import { WebSocketRequest } from '../models/types';
import { deepJSONParse } from './helpers/deepJSONParse'

export function startWebSocketServer() {
    const PORT = 3000;
    const server = new WebSocket.Server({ port: PORT });

    server.on('connection', (ws) => {
        ws.on('message', (message) => {
            const parsedMessage = deepJSONParse(message.toString());
            const responses = MessageHandler(parsedMessage as unknown as WebSocketRequest);
            responses.forEach((res) => ws.send(res))
        });

        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    });

    console.log(`WebSocket server is running on ${PORT} port`);
}
