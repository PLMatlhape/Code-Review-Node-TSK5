"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        name: process.env.DATABASE_NAME || 'code_review_db',
        user: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || ''
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default_secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
};
//# sourceMappingURL=env.js.map