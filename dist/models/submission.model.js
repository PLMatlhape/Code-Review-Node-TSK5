"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmissionModel = void 0;
const database_1 = require("../config/database");
class SubmissionModel {
    static async create(submitterId, data) {
        const result = await (0, database_1.query)(`INSERT INTO submissions (project_id, submitter_id, title, description, code_content, file_name, language) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`, [data.project_id, submitterId, data.title, data.description, data.code_content, data.file_name, data.language]);
        return result.rows[0];
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM submissions WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    static async findByProject(projectId) {
        const result = await (0, database_1.query)('SELECT * FROM submissions WHERE project_id = $1 ORDER BY created_at DESC', [projectId]);
        return result.rows;
    }
    static async findBySubmitter(submitterId) {
        const result = await (0, database_1.query)('SELECT * FROM submissions WHERE submitter_id = $1 ORDER BY created_at DESC', [submitterId]);
        return result.rows;
    }
    static async updateStatus(id, status) {
        const result = await (0, database_1.query)(`UPDATE submissions SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`, [status, id]);
        return result.rows[0];
    }
    static async update(id, updates) {
        const setClauses = [];
        const values = [];
        let paramCount = 1;
        if (updates.title !== undefined) {
            setClauses.push(`title = $${paramCount}`);
            values.push(updates.title);
            paramCount++;
        }
        if (updates.description !== undefined) {
            setClauses.push(`description = $${paramCount}`);
            values.push(updates.description);
            paramCount++;
        }
        if (updates.code_content !== undefined) {
            setClauses.push(`code_content = $${paramCount}`);
            values.push(updates.code_content);
            paramCount++;
        }
        if (updates.file_name !== undefined) {
            setClauses.push(`file_name = $${paramCount}`);
            values.push(updates.file_name);
            paramCount++;
        }
        if (updates.language !== undefined) {
            setClauses.push(`language = $${paramCount}`);
            values.push(updates.language);
            paramCount++;
        }
        values.push(id);
        const result = await (0, database_1.query)(`UPDATE submissions SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramCount} 
       RETURNING *`, values);
        return result.rows[0];
    }
    static async delete(id) {
        const result = await (0, database_1.query)('DELETE FROM submissions WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}
exports.SubmissionModel = SubmissionModel;
//# sourceMappingURL=submission.model.js.map