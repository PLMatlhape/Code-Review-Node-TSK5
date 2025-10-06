"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const database_1 = require("../config/database");
class ReviewModel {
    static async create(submissionId, reviewerId, data) {
        const result = await (0, database_1.query)(`INSERT INTO reviews (submission_id, reviewer_id, status, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`, [submissionId, reviewerId, data.status, data.comment]);
        return result.rows[0];
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM reviews WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    static async findBySubmission(submissionId) {
        const result = await (0, database_1.query)('SELECT * FROM reviews WHERE submission_id = $1 ORDER BY created_at ASC', [submissionId]);
        return result.rows;
    }
    static async findByReviewer(reviewerId) {
        const result = await (0, database_1.query)('SELECT * FROM reviews WHERE reviewer_id = $1 ORDER BY created_at DESC', [reviewerId]);
        return result.rows;
    }
    static async findLatestForSubmission(submissionId) {
        const result = await (0, database_1.query)('SELECT * FROM reviews WHERE submission_id = $1 ORDER BY created_at DESC LIMIT 1', [submissionId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    static async delete(id) {
        const result = await (0, database_1.query)('DELETE FROM reviews WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
}
exports.ReviewModel = ReviewModel;
//# sourceMappingURL=review.model.js.map