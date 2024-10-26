import { RegRequest, WebSocketRequest, WebSocketResponse } from "../models/types";
import { register } from "./helpers/register";
import { updateWinners } from './helpers/updateWinners';
import { updateRoom } from './helpers/updateRoom';

const stringifyResponse = (response: WebSocketResponse) => 
  JSON.stringify({ 
      type: response.type,
      data: JSON.stringify(response.data),
      id: response.id 
  });

export default function MessageHandler(message: WebSocketRequest): string[] {
  const responses: string[] = [];

  switch (message.type) {
    case 'reg':
        const resReg = register(message as RegRequest);
        responses.push(stringifyResponse(resReg));
        const resUW = updateWinners()
        responses.push(stringifyResponse(resUW));
        const resUR = updateRoom();
        responses.push(stringifyResponse(resUR));
    break
    // case 'create_room':

    //   console.log(`Room created`);
    //   break;
    // case 'add_user_to_room':

    //   console.log(`User added to room ${message.data?.indexRoom}`);
    //   break;
    // case 'create_game':

    //   console.log(`Game created with ID: ${message.data?.idGame}`);
    //   break;
    // case 'update_room':

    //   console.log(`Rooms updated`, message.data);
    //   break;
    // case 'add_ships':

    //   console.log(`Ships added for player ${message.data.indexPlayer}`);
    //   break;
    // case 'start_game':

    //   console.log(`Game started for player ${message.data.currentPlayerIndex}`);
    //   break;
    // case 'attack':

    //   console.log(`Attack`);
    //   break;
    // case 'randomAttack':

    //   console.log(`Random attack by player ${message.data.indexPlayer}`);
    //   break;
    // case 'turn':

    //   console.log(`It's player ${message.data.currentPlayer}'s turn`);
    //   break;
    // case 'finish':

    //   console.log(`Player ${message.data.winPlayer} wins`);
    //   break;
    default:
      responses.push(JSON.stringify({ error: 'Unknown request type' }));
  }

  return responses;
}