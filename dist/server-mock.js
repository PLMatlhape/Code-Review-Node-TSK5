"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const env_1 = require("./config/env");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mode: 'development',
        database: 'mock'
    });
});
// Mock API responses for testing
app.post('/api/auth/register', (req, res) => {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email, password and name'
        });
    }
    res.status(201).json({
        success: true,
        data: {
            user: {
                id: 'mock-user-id-' + Date.now(),
                email,
                name,
                role: role || 'submitter',
                created_at: new Date()
            },
            token: 'mock-jwt-token-' + Date.now()
        }
    });
});
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }
    if (password === 'wrongpassword') {
        return res.status(401).json({
            success: false,
            error: 'Incorrect password. Please try again.'
        });
    }
    res.json({
        success: true,
        data: {
            user: {
                id: 'mock-user-id',
                email,
                name: 'Mock User',
                role: 'submitter'
            },
            token: 'mock-jwt-token-' + Date.now()
        }
    });
});
app.get('/api/users/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Please log in to access this feature.'
        });
    }
    res.json({
        success: true,
        data: {
            id: 'mock-user-id',
            email: 'test@example.com',
            name: 'Mock User',
            role: 'submitter',
            created_at: new Date()
        }
    });
});
app.post('/api/projects', (req, res) => {
    const { name, description } = req.body;
    res.status(201).json({
        success: true,
        data: {
            id: 'mock-project-id-' + Date.now(),
            name,
            description,
            owner_id: 'mock-user-id',
            created_at: new Date()
        }
    });
});
app.get('/api/projects', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: 'mock-project-1',
                name: 'Sample Project',
                description: 'A sample project for testing',
                owner_id: 'mock-user-id',
                created_at: new Date()
            }
        ]
    });
});
// Catch all other routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        error: `The endpoint '${req.originalUrl}' doesn't exist. This is a mock development server.`
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoints should start with /api/'
    });
});
console.log('🚀 Starting Development Mock Server...');
console.log('📝 This server provides mock responses for API testing');
console.log('🔗 Connect to database later by updating .env file');
server.listen(env_1.config.port, () => {
    console.log(`✅ Mock server running on port ${env_1.config.port}`);
    console.log(`🌐 Health check: http://localhost:${env_1.config.port}/health`);
    console.log(`📚 API base: http://localhost:${env_1.config.port}/api`);
    console.log('');
    console.log('🧪 Test the API now with:');
    console.log('- Postman collection (postman-collection.json)');
    console.log('- HTTP file (api-tests.http)');
    console.log('- Test runner: node test-runner.js');
});
exports.default = app;
//# sourceMappingURL=server-mock.js.map