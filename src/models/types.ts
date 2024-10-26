export interface PlayerData {
    id: number;
    name: string;
    password: string;
    wins: number;
}

export interface RoomData {
    id: number | string;
    players: PlayerData[];
    gameId?: number | string | null; 
}

export type WebSocketRequest =
  | RegRequest
  | CreateRoomRequest
  | AddUserToRoomRequest
  | AddShipsRequest
  | AttackRequest
  | RandomAttackRequest;

export type WebSocketResponse =
  | RegResponse
  | UpdateWinnersResponse
  | CreateGameResponse
  | UpdateRoomResponse
  | StartGameResponse
  | AttackResponse
  | TurnResponse
  | FinishGameResponse;

export type WebSocketMessage = WebSocketRequest | WebSocketResponse;

//Player

export interface RegRequest {
    type: "reg";
    data: {
      name: string;
      password: string;
    };
    id: 0;
  }
  
export interface RegResponse {
    type: "reg";
    data: {
      name: string;
      index: number | string;
      error: boolean;
      errorText: string;
    };
    id: 0;
  }
  
export interface UpdateWinnersResponse {
    type: "update_winners";
    data: Array<{
      name: string;
      wins: number;
    }>;
    id: 0;
  }
  
//Room

export interface CreateRoomRequest {
    type: "create_room";
    data: string;
    id: 0;
  }
  
export interface AddUserToRoomRequest {
    type: "add_user_to_room";
    data: {
      indexRoom: number | string;
    };
    id: 0;
  }
  
export interface CreateGameResponse {
    type: "create_game";
    data: {
      idGame: number | string;
      idPlayer: number | string;
    };
    id: 0;
  }
  
export interface UpdateRoomResponse {
    type: "update_room";
    data: Array<{
      roomId: number | string;
      roomUsers: Array<{
        name: string;
        index: number | string;
      }>;
    }>;
    id: 0;
  }  

// Ship

export interface AddShipsRequest {
    type: "add_ships";
    data: {
      gameId: number | string;
      ships: Array<{
        position: { x: number; y: number };
        direction: boolean;
        length: number;
        type: "small" | "medium" | "large" | "huge";
      }>;
      indexPlayer: number | string;
    };
    id: 0;
  }
  

export interface StartGameResponse {
    type: "start_game";
    data: {
      ships: Array<{
        position: { x: number; y: number };
        direction: boolean;
        length: number;
        type: "small" | "medium" | "large" | "huge";
      }>;
      currentPlayerIndex: number | string;
    };
    id: 0;
  }

// Game

export interface AttackRequest {
    type: "attack";
    data: {
      gameId: number | string;
      x: number;
      y: number;
      indexPlayer: number | string;
    };
    id: 0;
  }
  

export interface AttackResponse {
    type: "attack";
    data: {
      position: { x: number; y: number };
      currentPlayer: number | string;
      status: "miss" | "killed" | "shot";
    };
    id: 0;
  }
  

export interface RandomAttackRequest {
    type: "randomAttack";
    data: {
      gameId: number | string;
      indexPlayer: number | string;
    };
    id: 0;
  }
  

export interface TurnResponse {
    type: "turn";
    data: {
      currentPlayer: number | string;
    };
    id: 0;
  }
  

export interface FinishGameResponse {
    type: "finish";
    data: {
      winPlayer: number | string;
    };
    id: 0;
  }
  