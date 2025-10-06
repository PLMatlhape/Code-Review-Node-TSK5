import { Server } from 'http';
export declare class WebSocketServer {
    private wss;
    private clients;
    constructor(server: Server);
    private initialize;
    sendToUser(userId: string, data: any): void;
    broadcast(data: any): void;
}
//# sourceMappingURL=websocket.d.ts.map