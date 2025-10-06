"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const database_1 = require("../config/database");
const submission_types_1 = require("../types/submission.types");
const submission_service_1 = require("./submission.service");
const notification_service_1 = require("./notification.service");
const submissionService = new submission_service_1.SubmissionService();
const notificationService = new notification_service_1.NotificationService();
class ReviewService {
    setWebSocketServer(wsServer) {
        this.wsServer = wsServer;
    }
    async createReview(submissionId, reviewerId, data) {
        const canAccess = await submissionService.canAccessSubmission(submissionId, reviewerId);
        if (!canAccess) {
            throw new Error('You don\'t have permission to review this submission.');
        }
        const isSubmitter = await submissionService.isSubmitter(submissionId, reviewerId);
        if (isSubmitter) {
            throw new Error('You cannot review your own code submission.');
        }
        const result = await (0, database_1.query)(`INSERT INTO reviews (submission_id, reviewer_id, status, comment) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`, [submissionId, reviewerId, data.status, data.comment]);
        await submissionService.updateSubmissionStatus(submissionId, data.status);
        const submission = await (0, database_1.query)('SELECT submitter_id FROM submissions WHERE id = $1', [submissionId]);
        const submitterId = submission.rows[0].submitter_id;
        await notificationService.notifyReview(submissionId, reviewerId, submitterId, data.status);
        if (this.wsServer) {
            const statusEmoji = data.status === 'approved' ? '✅' : '🔄';
            const statusText = data.status === 'approved' ? 'approved' : 'needs changes';
            this.wsServer.sendToUser(submitterId, {
                type: 'new_review',
                title: `${statusEmoji} Code Review Complete`,
                message: `Your submission has been ${statusText}`,
                submission_id: submissionId,
                review: result.rows[0]
            });
        }
        return result.rows[0];
    }
    async approveSubmission(submissionId, reviewerId, comment) {
        return this.createReview(submissionId, reviewerId, {
            status: submission_types_1.SubmissionStatus.APPROVED,
            comment
        });
    }
    async requestChanges(submissionId, reviewerId, comment) {
        return this.createReview(submissionId, reviewerId, {
            status: submission_types_1.SubmissionStatus.CHANGES_REQUESTED,
            comment
        });
    }
    async getReviewHistory(submissionId) {
        const result = await (0, database_1.query)(`SELECT r.*, u.name as reviewer_name, u.email as reviewer_email, u.display_picture
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.submission_id = $1
       ORDER BY r.created_at DESC`, [submissionId]);
        return result.rows;
    }
    async getReviewById(reviewId) {
        const result = await (0, database_1.query)(`SELECT r.*, u.name as reviewer_name, u.email as reviewer_email
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.id = $1`, [reviewId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    async getReviewsByReviewer(reviewerId) {
        const result = await (0, database_1.query)(`SELECT r.*, s.title as submission_title, p.name as project_name
       FROM reviews r
       JOIN submissions s ON r.submission_id = s.id
       JOIN projects p ON s.project_id = p.id
       WHERE r.reviewer_id = $1
       ORDER BY r.created_at DESC`, [reviewerId]);
        return result.rows;
    }
    async getLatestReviewForSubmission(submissionId) {
        const result = await (0, database_1.query)(`SELECT r.*, u.name as reviewer_name, u.email as reviewer_email
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.submission_id = $1
       ORDER BY r.created_at DESC
       LIMIT 1`, [submissionId]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
}
exports.ReviewService = ReviewService;
//# sourceMappingURL=review.service.js.map