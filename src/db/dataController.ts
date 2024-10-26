import { PlayerData, RoomData } from "../models/types";

export default class DataController {
    private static instance: DataController | null = null;
    private playerData: PlayerData[];
    private roomsData: RoomData[];

    private constructor() {
        this.playerData = [];
        this.roomsData = [];
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

    public setPlayerData(data: {name: string, password: string}): number {
        const newPlayer: PlayerData = { ...data, wins: 0, id: this.playerData.length };
        this.playerData.push(newPlayer);
        return this.playerData.length - 1;
    }

    public getPlayerData(): PlayerData[] {
        return this.playerData;
    }

    public getPlayer(name: string){
        return this.playerData.find(player => player.name === name);
    }

    public addRoom(player: PlayerData){
        const newRoom = {
            id: this.roomsData.length,
            players: [player],
            gameId: null,
        }
        return this.roomsData.push(newRoom)
    }

    public addUserToRoom(indexRoom: number, player: PlayerData): boolean {
        const maxPlayersInOneRoom = 2;
        const room = this.roomsData[indexRoom];

        if (room && room.players.length < maxPlayersInOneRoom) {
            room.players.push(player);
            return true;
        } else {
            return false;
        }
    }

    public getAvailableRooms(): RoomData[] {
        return this.roomsData.filter(room => room.players.length === 1);
    }

    public getAllRooms(): RoomData[]{
        return this.roomsData
    }
}
