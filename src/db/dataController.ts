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

    public setPlayerData(data: PlayerData): number {
        this.playerData.push(data);
        return this.playerData.length - 1;
    }

    public getPlayerData(): PlayerData[] {
        return this.playerData;
    }
}
