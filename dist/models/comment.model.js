"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentModel = void 0;
const database_1 = require("../config/database");
class CommentModel {
    static async create(submissionId, userId, data) {
        const result = await (0, database_1.query)(`INSERT INTO comments (submission_id, user_id, content, line_number) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`, [submissionId, userId, data.content, data.line_number]);
        return result.rows[0];
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM comments WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    static async findBySubmission(submissionId) {
        const result = await (0, database_1.query)('SELECT * FROM comments WHERE submission_id = $1 ORDER BY created_at ASC', [submissionId]);
        return result.rows;
    }
    static async update(id, content) {
        const result = await (0, database_1.query)(`UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`, [content, id]);
        return result.rows[0];
    }
    static async delete(id) {
        const result = await (0, database_1.query)('DELETE FROM comments WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
    static async findByUser(userId) {
        const result = await (0, database_1.query)('SELECT * FROM comments WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        return result.rows;
    }
}
exports.CommentModel = CommentModel;
//# sourceMappingURL=comment.model.js.map