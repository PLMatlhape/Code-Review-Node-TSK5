"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
const user_types_1 = require("../types/user.types");
class UserModel {
    static async create(email, passwordHash, name, role) {
        const result = await (0, database_1.query)(`INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, role, display_picture, created_at, updated_at`, [email, passwordHash, name, role || user_types_1.UserRole.SUBMITTER]);
        return result.rows[0];
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT id, email, name, display_picture, role, created_at, updated_at FROM users WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    static async findByEmail(email) {
        const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    static async update(id, updates) {
        const setClauses = [];
        const values = [];
        let paramCount = 1;
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id') {
                setClauses.push(`${key} = $${paramCount}`);
                values.push(value);
                paramCount++;
            }
        });
        values.push(id);
        const result = await (0, database_1.query)(`UPDATE users SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING id, email, name, display_picture, role, created_at, updated_at`, values);
        return result.rows[0];
    }
    static async delete(id) {
        const result = await (0, database_1.query)('DELETE FROM users WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user.model.js.map