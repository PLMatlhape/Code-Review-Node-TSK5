"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async register(data) {
        const existingUser = await (0, database_1.query)('SELECT id FROM users WHERE email = $1', [data.email]);
        if (existingUser.rows.length > 0) {
            throw new Error('This email is already taken. Try signing in instead.');
        }
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        const result = await (0, database_1.query)(`INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, role, display_picture, created_at, updated_at`, [data.email, passwordHash, data.name, data.role || 'submitter']);
        const user = result.rows[0];
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        return { user, token };
    }
    async login(data) {
        const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1', [data.email]);
        if (result.rows.length === 0) {
            throw new Error('No account found with this email. Please check your email or sign up.');
        }
        const user = result.rows[0];
        const isValidPassword = await (0, password_1.comparePassword)(data.password, user.password_hash);
        if (!isValidPassword) {
            throw new Error('Incorrect password. Please try again.');
        }
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
            role: user.role
        });
        const { password_hash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map