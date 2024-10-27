import DataController from "../../db/dataController";
import { AttackRequest, AttackResponse } from "../../models/types";

export function attack(message: AttackRequest): AttackResponse | null {
    const data = DataController.getInstance();
    const game = data.getGameById(Number(message.data.gameId));
    if (!game) return null

    const currentPlayerId = Number(message.data.indexPlayer);

    const isYourTurn = game.turn === currentPlayerId;
    if(!isYourTurn)return null

    const opponentStatus = game.gameStatus.find(status => status.indexPlayer !== currentPlayerId);
    if (!opponentStatus) return null

    const { x, y } = message.data;
    let status: "miss" | "shot" | "killed" = "miss";

    if (opponentStatus.matrix[y][x] === 1) {
        status = "shot";
        opponentStatus.matrix[y][x] = -1;

        const arr = Object.values(opponentStatus.ships);

        const isKilled = arr.some(ship => {
            const positions = Array.from({ length: ship.length }, (_, i) => ({
                x: ship.direction ? ship.position.x + i : ship.position.x,
                y: ship.direction ? ship.position.y : ship.position.y + i,
            }));
            
            return positions.every(pos => opponentStatus.matrix[pos.y][pos.x] === -1);
        });

        if (isKilled) {
            status = "killed";
        }
    }

    return {
        type: "attack",
        data: {
            position: { x, y },
            currentPlayer: currentPlayerId,
            status,
        },
        id: 0,
    };
}
