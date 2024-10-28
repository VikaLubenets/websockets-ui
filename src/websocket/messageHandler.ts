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
import { addTurn } from "./helpers/addTurn";
import { attack } from "./helpers/attack";
import { randomAttack } from "./helpers/randomAttack";
import { finish } from "./helpers/finish";
import { addSameTurn } from "./helpers/addSameTurn";

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
        console.log(`Sent response to all players:`, resUW);

        const resUR = updateRoom();
        allPlayers.forEach(player => player.connection.send(stringifyResponse(resUR)))
        console.log(`Sent response to all players:`, resUR);
      }
    break
    case 'create_room':
      const resCR = createRoom(message, playerId);
      allPlayers.forEach(player => player.connection.send(stringifyResponse(resCR)))
      console.log(`Sent response to all players:`, resCR);

      break;
    case 'add_user_to_room':
      const { resAUTR, shouldCreateGame } = addUserToRoom(message, playerId);
      if (resAUTR) {
        allPlayers.forEach(player => player.connection.send(stringifyResponse(resAUTR)))
        console.log(`Sent response to all players:`, resAUTR);
      }
      if (shouldCreateGame) {
          const room = data.getRoomById(Number(message.data.indexRoom))
          if(room){
            const players = room.players

            const firstM = createGame(Number(message.data.indexRoom), players[0].id);
            const secondM = createGame(Number(message.data.indexRoom), players[1].id);
            players[0].connection.send(stringifyResponse(firstM))
            players[1].connection.send(stringifyResponse(secondM))
            console.log(`Sent response to the game room id ${room.id} and player ${players[0].id}:`, firstM);
            console.log(`Sent response to the game room id ${room.id} and player ${players[1].id}:`, secondM);
          }
      }
      break;

    case 'add_ships':
      const { shouldStartGame } = addShips(message);
      if (shouldStartGame) {
          const room = data.getRoomByGameId(Number(message.data.gameId))
          if(room){
            const players = room.players;
            const startMessageP1 = stringifyResponse(startGame(players[0].id, Number(message.data.gameId)));
            const startMessageP2 = stringifyResponse(startGame(players[1].id, Number(message.data.gameId)));
            
            players[0].connection.send(startMessageP1);
            players[1].connection.send(startMessageP2);

            console.log(`Sent response to the game room id ${room.id} and player ${players[0].id}:`, startMessageP1);
            console.log(`Sent response to the game room id ${room.id} and player ${players[1].id}:`, startMessageP2);

            const turnRes = addTurn(Number(message.data.gameId));
            players[0].connection.send(stringifyResponse(turnRes));
            players[1].connection.send(stringifyResponse(turnRes));
            console.log(`Sent response to the game room id ${room.id} and both players:`, turnRes);
          }
      }
      break;

    case 'attack':
      const room = data.getRoomByGameId(Number(message.data.gameId))
      if(room){
        const players = room.players;
        const { response: resA, gameWon, winnerId} = attack(message)
        if(resA){
          players[0].connection.send(stringifyResponse(resA));
          players[1].connection.send(stringifyResponse(resA));
          console.log(`Sent response to the game room id ${room.id} and both players:`, resA);

          if(gameWon && winnerId !== null){
            const resGW = finish(winnerId, Number(message.data.gameId))
            players[0].connection.send(stringifyResponse(resGW));
            players[1].connection.send(stringifyResponse(resGW));
            console.log(`Sent response to the game room id ${room.id} and both players:`, resGW);

            const resUW = updateWinners()
            allPlayers.forEach(player => player.connection.send(stringifyResponse(resUW)))
            console.log(`Sent response to all players:`, resUW);
          } else {

            if(resA.data.status === 'shot' || resA.data.status === 'killed'){
              const turnResA = addSameTurn(Number(message.data.gameId));
              players[0].connection.send(stringifyResponse(turnResA));
              players[1].connection.send(stringifyResponse(turnResA));
              console.log(`Sent response to the game room id ${room.id} and both players:`, turnResA);
            } else {
              const turnResA = addTurn(Number(message.data.gameId));
              players[0].connection.send(stringifyResponse(turnResA));
              players[1].connection.send(stringifyResponse(turnResA));
              console.log(`Sent response to the game room id ${room.id} and both players:`, turnResA);
            }
          }
        }
      }
      break;
    case 'randomAttack':
      const roomRA = data.getRoomByGameId(Number(message.data.gameId))
      if(roomRA){
        const players = roomRA.players;
        const { response: resRA, gameWon, winnerId} = randomAttack(message)
        if(resRA){
          players[0].connection.send(stringifyResponse(resRA));
          players[1].connection.send(stringifyResponse(resRA));
          console.log(`Sent response to the game room id ${roomRA.id} and both players:`, resRA);

          if(gameWon && winnerId !== null){
            const resGW = finish(winnerId, Number(message.data.gameId))
            players[0].connection.send(stringifyResponse(resGW));
            players[1].connection.send(stringifyResponse(resGW));
            console.log(`Sent response to the game room id ${roomRA.id} and both players:`, resGW);

            const resUW = updateWinners()
            allPlayers.forEach(player => player.connection.send(stringifyResponse(resUW)))
            console.log(`Sent response to all players:`, resUW);
          } else {
            if(resRA.data.status === 'shot' || resRA.data.status === 'killed'){
              const turnResA = addSameTurn(Number(message.data.gameId));
              players[0].connection.send(stringifyResponse(turnResA));
              players[1].connection.send(stringifyResponse(turnResA));
              console.log(`Sent response to the game room id ${roomRA.id} and both players:`, turnResA);
            } else {
              const turnResA = addTurn(Number(message.data.gameId));
              players[0].connection.send(stringifyResponse(turnResA));
              players[1].connection.send(stringifyResponse(turnResA));
              console.log(`Sent response to the game room id ${roomRA.id} and both players:`, turnResA);
            }
          }
        }
      }
      break;

    default:
      responses.push(JSON.stringify({ error: 'Unknown request type' }));
  }

  return responses;
}