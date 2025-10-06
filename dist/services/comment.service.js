"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const database_1 = require("../config/database");
const submission_service_1 = require("./submission.service");
const notification_service_1 = require("./notification.service");
const submissionService = new submission_service_1.SubmissionService();
const notificationService = new notification_service_1.NotificationService();
class CommentService {
    setWebSocketServer(wsServer) {
        this.wsServer = wsServer;
    }
    async createComment(submissionId, userId, data) {
        const canAccess = await submissionService.canAccessSubmission(submissionId, userId);
        if (!canAccess) {
            throw new Error('You don\'t have permission to comment on this submission.');
        }
        const isSubmitter = await submissionService.isSubmitter(submissionId, userId);
        if (isSubmitter) {
            throw new Error('You cannot comment on your own code submission.');
        }
        const result = await (0, database_1.query)(`INSERT INTO comments (submission_id, user_id, content, line_number) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`, [submissionId, userId, data.content, data.line_number]);
        const submission = await (0, database_1.query)('SELECT submitter_id FROM submissions WHERE id = $1', [submissionId]);
        const submitterId = submission.rows[0].submitter_id;
        await notificationService.notifyComment(submissionId, userId, submitterId);
        if (this.wsServer) {
            this.wsServer.sendToUser(submitterId, {
                type: 'new_comment',
                title: '💬 New Comment',
                message: 'Someone reviewed your code and left feedback',
                submission_id: submissionId,
                comment: result.rows[0]
            });
        }
        return result.rows[0];
    }
    async getCommentsBySubmission(submissionId) {
        const result = await (0, database_1.query)(`SELECT c.*, u.name as user_name, u.email as user_email, u.display_picture
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.submission_id = $1
       ORDER BY c.line_number NULLS LAST, c.created_at ASC`, [submissionId]);
        return result.rows;
    }
    async getCommentById(commentId) {
        const result = await (0, database_1.query)(`SELECT c.*, u.name as user_name, u.email as user_email
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`, [commentId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async updateComment(commentId, content) {
        const result = await (0, database_1.query)(`UPDATE comments 
       SET content = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`, [content, commentId]);
        return result.rows[0];
    }
    async deleteComment(commentId) {
        await (0, database_1.query)('DELETE FROM comments WHERE id = $1', [commentId]);
    }
    async isCommentOwner(commentId, userId) {
        const result = await (0, database_1.query)('SELECT 1 FROM comments WHERE id = $1 AND user_id = $2', [commentId, userId]);
        return result.rows.length > 0;
    }
    async canAccessComment(commentId, userId) {
        const result = await (0, database_1.query)(`SELECT 1 FROM comments c
       JOIN submissions s ON c.submission_id = s.id
       WHERE c.id = $1 
       AND (
         s.submitter_id = $2 
         OR c.user_id = $2
         OR EXISTS (
           SELECT 1 FROM project_members pm 
           WHERE pm.project_id = s.project_id AND pm.user_id = $2
         )
         OR EXISTS (
           SELECT 1 FROM projects p 
           WHERE p.id = s.project_id AND p.owner_id = $2
         )
       )`, [commentId, userId]);
        return result.rows.length > 0;
    }
}
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map