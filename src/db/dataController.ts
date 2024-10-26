import { PlayerData } from "../models/types";

export default class DataController {
    private static instance: DataController | null = null;
    private playerData: PlayerData[];

    private constructor() {
        this.playerData = [];
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
        const newPlayer: PlayerData = { ...data, wins: 0 };
        this.playerData.push(newPlayer);
        return this.playerData.length - 1;
    }

    public getPlayerData(): PlayerData[] {
        return this.playerData;
    }

    public getPlayer(name: string){
        return this.playerData.find(player => player.name === name);
    }
}
