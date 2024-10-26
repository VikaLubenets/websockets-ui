import WebSocket from 'ws';
import MessageHandler from './messageHandler';
import { WebSocketMessage } from '../models/types';

export function startWebSocketServer() {
    const PORT = 3000;
    const server = new WebSocket.Server({ port: PORT });

    server.on('connection', (ws) => {
        ws.on('message', (message) => {
            const parsedMessage = JSON.parse(message.toString()) as WebSocketMessage;
            MessageHandler(parsedMessage);
        });

        ws.on('close', () => {
            console.log('WebSocket disconnected');
        });
    });

    console.log(`WebSocket server is running on ${PORT} port`);
}
