// src/type/mqttType.ts
export interface CommandMessage {
    type: string;
    num?: string;
}

export interface CommandResponse {
    success: boolean;
    message: string;
    payload?: any;
}
