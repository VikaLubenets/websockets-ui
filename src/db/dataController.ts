import { PlayerData } from "../models/types";

export default class DataController {
    private static instance: DataController | null = null;
    playerData: PlayerData[] | null;

    private constructor() {
        this.playerData = null;
    }

    public static getInstance(): DataController {
        if (!DataController.instance) {
            DataController.instance = new DataController();
        }
        return DataController.instance;
    }


}