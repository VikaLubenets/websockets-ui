import { Player, RegRequest, WebSocketRequest, WebSocketResponse } from "../models/types";
import { register } from "./helpers/register";
import { updateWinners } from './helpers/updateWinners';
import { updateRoom } from './helpers/updateRoom';
import { stringifyResponse } from "./helpers/stringifyResponse";
import { createRoom } from "./helpers/createRoom";
import { addUserToRoom } from "./helpers/addUserToRoom";
import { createGame } from "./helpers/createGame";
import DataController from "../db/dataController";

export default function MessageHandler(message: WebSocketRequest, playerId: number, options?: Player,): string[] {
  const responses: string[] = [];
  const data = DataController.getInstance();
  const allPlayers = data.getAllPlayers()

  switch (message.type) {
    case 'reg':
      if(options){
        const resReg = register(message as RegRequest, options);
        responses.push(stringifyResponse(resReg));

        const resUW = updateWinners()
        allPlayers.forEach(player => player.connection.send(stringifyResponse(resUW)))

        const resUR = updateRoom();
        allPlayers.forEach(player => player.connection.send(stringifyResponse(resUR)))
      }
    break
    case 'create_room':
      const resCR = createRoom(message, playerId);
      allPlayers.forEach(player => player.connection.send(stringifyResponse(resCR)))

      break;
    case 'add_user_to_room':
      const { resAUTR, shouldCreateGame } = addUserToRoom(message, playerId);
      if (resAUTR) {
        allPlayers.forEach(player => player.connection.send(stringifyResponse(resAUTR)))
      }
      if (shouldCreateGame) {
          const room = data.getRoomById(Number(message.data.indexRoom))
          if(room){
            const players = room.players
            players[0].connection.send(stringifyResponse(createGame(Number(message.data.indexRoom), players[0].id)))
            players[1].connection.send(stringifyResponse(createGame(Number(message.data.indexRoom), players[1].id)))
          }
      }
      break;

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