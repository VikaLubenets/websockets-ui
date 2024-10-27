import { Game, Player, PlayerData, RoomData, Ship } from "../models/types";

export default class DataController {
    private static instance: DataController | null = null;
    private playerData: PlayerData[];
    private roomsData: RoomData[];
    private gameId: number;
    private games: Game[];

    private constructor() {
        this.playerData = [];
        this.roomsData = [];
        this.gameId = 0;
        this.games = [];
    }

    public static getInstance(): DataController {
        if (!DataController.instance) {
            DataController.instance = new DataController();
        }
        return DataController.instance;
    }

    public hasPlayer(name: string): boolean {
        return this.playerData.some(player => player.name === name);
    }

    public setPlayerData(data: {name: string, password: string}, options: Player): number {
        const newPlayer: PlayerData = { ...data, wins: 0, id: options.id, connection: options.connection };
        this.playerData.push(newPlayer);
        return this.playerData.length - 1;
    }

    public getPlayerByName(name: string){
        return this.playerData.find(player => player.name === name);
    }

    public getPlayerById(id: number){
        return this.playerData.find(player => player.id === id);
    }

    public getAllPlayers(): PlayerData[]{
        return this.playerData
    }

    public addRoom(player: PlayerData){
        const newRoom = {
            id: this.roomsData.length,
            players: [player],
            gameId: null,
        }
        return this.roomsData.push(newRoom)
    }

    public addUserToRoom(indexRoom: number | string, player: PlayerData): boolean {
        const maxPlayersInOneRoom = 2;
        const room = this.roomsData[Number(indexRoom)];
    
        if (room) {
            const isPlayerInRoom = room.players.some(existingPlayer => existingPlayer.id === player.id);
            if (isPlayerInRoom) {
                return false;
            }
    
            if (room.players.length < maxPlayersInOneRoom) {
                room.players.push(player);
                return true;
            }
        }
    
        return false;
    }

    public getAvailableRooms(): RoomData[] {
        return this.roomsData.filter(room => room.players.length === 1);
    }

    public getAllRooms(): RoomData[]{
        return this.roomsData
    }

    public getRoomById(id: number) {
        return this.roomsData.find(room => room.id === id);
    }

    public getRoomByGameId(id: number){
        return this.roomsData.find(room => room.gameId === id);
    }

    public createGame(roomId: number) {
        const room = this.roomsData.find(room => room.id === roomId);
        
        if (room) {
            if (room.gameId !== null) {
                return room;
            }
            
            const gameId = this.gameId++;
            room.gameId = gameId;
            const newGame: Game = {
                id: gameId,
                gameStatus: []
            };
            this.games.push(newGame);
            return room;
        }
    }

    public addShips(gameId: number, playerId: number, ships: Ship[]) {
        const game = this.games.find((game) => game.id === gameId);
    
        if (game) {
            const existingPlayerShips = game.gameStatus.find(status => status.indexPlayer === playerId);
            
            if (!existingPlayerShips) {
                const playerShips = {
                    indexPlayer: playerId,
                    ships
                };
                game.gameStatus.push(playerShips);
            }
    
            return game;
        }
    }

    public getGameById(gameId: number){
        return this.games.find((game) => game.id === gameId)
    }
}
