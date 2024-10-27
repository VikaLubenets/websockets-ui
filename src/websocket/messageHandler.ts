import { Player, RegRequest, WebSocketRequest, WebSocketResponse } from "../models/types";
import { register } from "./helpers/register";
import { updateWinners } from './helpers/updateWinners';
import { updateRoom } from './helpers/updateRoom';
import { stringifyResponse } from "./helpers/stringifyResponse";
import { createRoom } from "./helpers/createRoom";
import { addUserToRoom } from "./helpers/addUserToRoom";
import { createGame } from "./helpers/createGame";
import DataController from "../db/dataController";
import { addShips } from "./helpers/addShips";
import { startGame } from "./helpers/startGame";

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
          console.log('room', data.getRoomById(Number(message.data.indexRoom)))
      }
      break;

    case 'add_ships':
      const { shouldStartGame } = addShips(message);
      console.log('shouldStartGame 1', shouldStartGame)
      if (shouldStartGame) {
        console.log('shouldStartGame 2', shouldStartGame)
          const room = data.getRoomByGameId(Number(message.data.gameId))
          if(room){
            console.log('shouldStartGame 3', shouldStartGame)
            const players = room.players;
            const startMessageP1 = stringifyResponse(startGame(players[0].id, Number(message.data.gameId)));
            const startMessageP2 = stringifyResponse(startGame(players[1].id, Number(message.data.gameId)));
            
            players[0].connection.send(startMessageP1);
            players[1].connection.send(startMessageP2);
          }
      }
      break;

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