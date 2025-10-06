"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
class UserService {
    async getUserById(userId) {
        const result = await (0, database_1.query)('SELECT id, email, name, display_picture, role, created_at, updated_at FROM users WHERE id = $1', [userId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async getUserByEmail(email) {
        const result = await (0, database_1.query)('SELECT id, email, name, display_picture, role, created_at, updated_at FROM users WHERE email = $1', [email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async updateUser(userId, data) {
        const setClauses = [];
        const values = [];
        let paramCount = 1;
        if (data.name !== undefined) {
            setClauses.push(`name = $${paramCount}`);
            values.push(data.name);
            paramCount++;
        }
        if (data.display_picture !== undefined) {
            setClauses.push(`display_picture = $${paramCount}`);
            values.push(data.display_picture);
            paramCount++;
        }
        if (data.email !== undefined) {
            setClauses.push(`email = $${paramCount}`);
            values.push(data.email);
            paramCount++;
        }
        if (setClauses.length === 0) {
            throw new Error('Please provide at least one field to update.');
        }
        setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(userId);
        const result = await (0, database_1.query)(`UPDATE users SET ${setClauses.join(', ')} 
       WHERE id = $${paramCount} 
       RETURNING id, email, name, display_picture, role, created_at, updated_at`, values);
        if (result.rows.length === 0) {
            throw new Error('This user no longer exists.');
        }
        return result.rows[0];
    }
    async getAllUsers() {
        const result = await (0, database_1.query)('SELECT id, email, name, display_picture, role, created_at, updated_at FROM users ORDER BY created_at DESC');
        return result.rows;
    }
    async deleteUser(userId) {
        const result = await (0, database_1.query)('DELETE FROM users WHERE id = $1', [userId]);
        if (result.rowCount === 0) {
            throw new Error('Cannot delete user - they may have already been removed.');
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map