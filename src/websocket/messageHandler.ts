import { WebSocketMessage } from "../models/types";

export default function MessageHandler(message: WebSocketMessage) {
  switch (message.type) {
    case 'reg':

      console.log(`Player ${message.data.name} is registering`);
      break;
    case 'update_winners':

      console.log(`Winners table updated:`, message.data);
      break;
    case 'create_room':

      console.log(`Room created`);
      break;
    case 'add_user_to_room':

      console.log(`User added to room ${message.data?.indexRoom}`);
      break;
    case 'create_game':

      console.log(`Game created with ID: ${message.data?.idGame}`);
      break;
    case 'update_room':

      console.log(`Rooms updated`, message.data);
      break;
    case 'add_ships':

      console.log(`Ships added for player ${message.data.indexPlayer}`);
      break;
    case 'start_game':

      console.log(`Game started for player ${message.data.currentPlayerIndex}`);
      break;
    case 'attack':

      console.log(`Attack`);
      break;
    case 'randomAttack':

      console.log(`Random attack by player ${message.data.indexPlayer}`);
      break;
    case 'turn':

      console.log(`It's player ${message.data.currentPlayer}'s turn`);
      break;
    case 'finish':

      console.log(`Player ${message.data.winPlayer} wins`);
      break;
    default:
      return JSON.stringify({ error: 'Unknown request type' });
  }
}
