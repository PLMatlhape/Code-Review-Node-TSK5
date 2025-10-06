import WebSocket from 'ws';
import { Server } from 'http';
import { verifyToken } from '../utils/jwt';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

export class WebSocketServer {
  private wss: WebSocket.Server;
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server, path: '/ws' });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      const token = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('token');

      if (!token) {
        ws.close(1008, 'Token required');
        return;
      }

      try {
        const decoded = verifyToken(token);
        ws.userId = decoded.userId;
        ws.isAlive = true;

        if (!this.clients.has(ws.userId)) {
          this.clients.set(ws.userId, new Set());
        }
        this.clients.get(ws.userId)!.add(ws);

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
      } catch (error) {
        ws.close(1008, 'Invalid token');
      }
    });

    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
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

  sendToUser(userId: string, data: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const message = JSON.stringify(data);
      userClients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  broadcast(data: any) {
    const message = JSON.stringify(data);
    this.wss.clients.forEach((client: AuthenticatedWebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}