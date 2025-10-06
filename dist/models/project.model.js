"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectModel = void 0;
const database_1 = require("../config/database");
class ProjectModel {
    static async create(ownerId, data) {
        const result = await (0, database_1.query)(`INSERT INTO projects (name, description, owner_id) 
       VALUES ($1, $2, $3) 
       RETURNING *`, [data.name, data.description, ownerId]);
        return result.rows[0];
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM projects WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    static async findByOwner(ownerId) {
        const result = await (0, database_1.query)('SELECT * FROM projects WHERE owner_id = $1', [ownerId]);
        return result.rows;
    }
    static async findAll() {
        const result = await (0, database_1.query)('SELECT * FROM projects ORDER BY created_at DESC');
        return result.rows;
    }
    static async update(id, updates) {
        const setClauses = [];
        const values = [];
        let paramCount = 1;
        if (updates.name !== undefined) {
            setClauses.push(`name = $${paramCount}`);
            values.push(updates.name);
            paramCount++;
        }
        if (updates.description !== undefined) {
            setClauses.push(`description = $${paramCount}`);
            values.push(updates.description);
            paramCount++;
        }
        values.push(id);
        const result = await (0, database_1.query)(`UPDATE projects SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING *`, values);
        return result.rows[0];
    }
    static async delete(id) {
        const result = await (0, database_1.query)('DELETE FROM projects WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}
exports.ProjectModel = ProjectModel;
//# sourceMappingURL=project.model.js.map