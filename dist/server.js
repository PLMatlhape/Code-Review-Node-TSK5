"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const websocket_1 = require("./websocket/websocket");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const submission_routes_1 = __importDefault(require("./routes/submission.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/submissions', submission_routes_1.default);
app.use('/api/comments', comment_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/notifications', notification_routes_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
const wsServer = new websocket_1.WebSocketServer(server);
exports.wsServer = wsServer;
// Connect WebSocket to services
const comment_service_1 = require("./services/comment.service");
const review_service_1 = require("./services/review.service");
const commentService = new comment_service_1.CommentService();
const reviewService = new review_service_1.ReviewService();
commentService.setWebSocketServer(wsServer);
reviewService.setWebSocketServer(wsServer);
// Test database connection first, then start server
database_1.pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
        console.log('');
        console.log('🔧 Please check:');
        console.log('1. PostgreSQL service is running');
        console.log('2. Database credentials in .env are correct');
        console.log('3. Database "code_review_db" exists');
        console.log('');
        process.exit(1);
    }
    console.log('✅ Database connected successfully');
    // Start server only after database connection is confirmed
    const hostname = '0.0.0.0';
    server.listen(Number(env_1.config.port), hostname, () => {
        const address = server.address();
        console.log('');
        console.log('='.repeat(50));
        console.log(`✅ Server running on port ${env_1.config.port}`);
        console.log(`📡 Server URL: http://localhost:${env_1.config.port}`);
        console.log(`🔌 WebSocket: ws://localhost:${env_1.config.port}/ws`);
        console.log(`🌐 Listening on: ${hostname}:${env_1.config.port}`);
        console.log(`🔍 Address:`, address);
        console.log('='.repeat(50));
        console.log('');
        console.log('🚀 Ready to accept requests!');
    }).on('error', (err) => {
        console.error('❌ Server failed to start:', err.message);
        if (err.code === 'EADDRINUSE') {
            console.log(`🔧 Port ${env_1.config.port} is already in use.`);
        }
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        database_1.pool.end();
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map