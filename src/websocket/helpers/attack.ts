import DataController from "../../db/dataController";
import { AttackRequest, AttackResponse } from "../../models/types";

export function attack(message: AttackRequest): { response: AttackResponse | null, gameWon: boolean, winnerId: number | null} {
    let gameWon = false;
    let winnerId: number | null = null;
    let response: AttackResponse | null = null;
    
    const data = DataController.getInstance();
    const game = data.getGameById(Number(message.data.gameId));
    if (!game) return { response, gameWon, winnerId}

    const currentPlayerId = Number(message.data.indexPlayer);

    const isYourTurn = game.turn === currentPlayerId;
    if(!isYourTurn) return { response, gameWon, winnerId}

    const opponentStatus = game.gameStatus.find(status => status.indexPlayer !== currentPlayerId);
    if (!opponentStatus) return { response, gameWon, winnerId}

    const { x, y } = message.data;
    let status: "miss" | "shot" | "killed" = "miss";

    if (opponentStatus.matrix[y][x] === 1) {
        status = "shot";
        opponentStatus.matrix[y][x] = -1;

        const arr = Object.values(opponentStatus.ships)
    
        const ship = arr.find(ship => {
            const positions = Array.from({ length: ship.length }, (_, i) => ({
                x: ship.direction ? ship.position.x : ship.position.x + i,
                y: ship.direction ? ship.position.y + i : ship.position.y,
            }));
    
            return positions.some(pos => pos.x === x && pos.y === y);
        });
    
        if (ship) {
            const isKilled = Array.from({ length: ship.length }, (_, i) => ({
                x: ship.direction ? ship.position.x : ship.position.x + i,
                y: ship.direction ? ship.position.y + i : ship.position.y,
            })).every(pos => opponentStatus.matrix[pos.y][pos.x] === -1);
    
            if (isKilled) {
                status = "killed";
                data.deleteShip(game.id, opponentStatus.indexPlayer);
    
                const remainingShips = data.getGameById(game.id)
                    ?.gameStatus.find(status => status.indexPlayer === opponentStatus.indexPlayer)?.remainingShips;
                    
                if (remainingShips === 0) {
                    winnerId = currentPlayerId;
                    gameWon = true;
                }
            }
        }
    }
    

    response = {
        type: "attack",
        data: {
            position: { x, y },
            currentPlayer: currentPlayerId,
            status,
        },
        id: 0,
    };

    return { response, gameWon, winnerId}
}
