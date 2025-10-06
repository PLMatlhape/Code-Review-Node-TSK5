"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const ws_1 = __importDefault(require("ws"));
const jwt_1 = require("../utils/jwt");
class WebSocketServer {
    constructor(server) {
        this.clients = new Map();
        this.wss = new ws_1.default.Server({ server, path: '/ws' });
        this.initialize();
    }
    initialize() {
        this.wss.on('connection', (ws, req) => {
            const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
            if (!token) {
                ws.close(1008, 'Token required');
                return;
            }
            try {
                const decoded = (0, jwt_1.verifyToken)(token);
                ws.userId = decoded.userId;
                ws.isAlive = true;
                if (!this.clients.has(ws.userId)) {
                    this.clients.set(ws.userId, new Set());
                }
                this.clients.get(ws.userId).add(ws);
                ws.on('pong', () => {
                    ws.isAlive = true;
                });
                ws.on('close', () => {
                    if (ws.userId) {
                        const userClients = this.clients.get(ws.userId);
                        if (userClients) {
                            userClients.delete(ws);
                            if (userClients.size === 0) {
                                this.clients.delete(ws.userId);
                            }
                        }
                    }
                });
                ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected' }));
            }
            catch (error) {
                ws.close(1008, 'Invalid token');
            }
        });
        const interval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (!ws.isAlive) {
                    return ws.terminate();
                }
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);
        this.wss.on('close', () => {
            clearInterval(interval);
        });
    }
    sendToUser(userId, data) {
        const userClients = this.clients.get(userId);
        if (userClients) {
            const message = JSON.stringify(data);
            userClients.forEach(ws => {
                if (ws.readyState === ws_1.default.OPEN) {
                    ws.send(message);
                }
            });
        }
    }
    broadcast(data) {
        const message = JSON.stringify(data);
        this.wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message);
            }
        });
    }
}
exports.WebSocketServer = WebSocketServer;
//# sourceMappingURL=websocket.js.map