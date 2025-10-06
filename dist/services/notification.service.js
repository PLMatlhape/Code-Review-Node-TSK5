"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = require("../config/database");
const notification_types_1 = require("../types/notification.types");
class NotificationService {
    async createNotification(data) {
        const result = await (0, database_1.query)(`INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`, [data.user_id, data.type, data.title, data.message, data.related_id]);
        return result.rows[0];
    }
    async getUserNotifications(userId, unreadOnly = false) {
        let queryText = `SELECT * FROM notifications WHERE user_id = $1`;
        if (unreadOnly) {
            queryText += ` AND is_read = false`;
        }
        queryText += ` ORDER BY created_at DESC LIMIT 50`;
        const result = await (0, database_1.query)(queryText, [userId]);
        return result.rows;
    }
    async markAsRead(notificationId) {
        await (0, database_1.query)('UPDATE notifications SET is_read = true WHERE id = $1', [notificationId]);
    }
    async markAllAsRead(userId) {
        await (0, database_1.query)('UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false', [userId]);
    }
    async getUnreadCount(userId) {
        const result = await (0, database_1.query)('SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false', [userId]);
        return parseInt(result.rows[0].count);
    }
    async deleteNotification(notificationId) {
        await (0, database_1.query)('DELETE FROM notifications WHERE id = $1', [notificationId]);
    }
    async notifyComment(submissionId, commenterId, submitterId) {
        const submission = await (0, database_1.query)('SELECT title FROM submissions WHERE id = $1', [submissionId]);
        const commenter = await (0, database_1.query)('SELECT name FROM users WHERE id = $1', [commenterId]);
        if (commenterId !== submitterId) {
            await this.createNotification({
                user_id: submitterId,
                type: notification_types_1.NotificationType.COMMENT,
                title: 'New Comment',
                message: `${commenter.rows[0].name} commented on your submission "${submission.rows[0].title}"`,
                related_id: submissionId
            });
        }
    }
    async notifyReview(submissionId, reviewerId, submitterId, status) {
        const submission = await (0, database_1.query)('SELECT title FROM submissions WHERE id = $1', [submissionId]);
        const reviewer = await (0, database_1.query)('SELECT name FROM users WHERE id = $1', [reviewerId]);
        const statusText = status === 'approved' ? 'approved' : 'requested changes for';
        await this.createNotification({
            user_id: submitterId,
            type: notification_types_1.NotificationType.REVIEW,
            title: 'Review Received',
            message: `${reviewer.rows[0].name} ${statusText} your submission "${submission.rows[0].title}"`,
            related_id: submissionId
        });
    }
    async notifyProjectAssignment(projectId, userId, assignedBy) {
        const project = await (0, database_1.query)('SELECT name FROM projects WHERE id = $1', [projectId]);
        const assigner = await (0, database_1.query)('SELECT name FROM users WHERE id = $1', [assignedBy]);
        await this.createNotification({
            user_id: userId,
            type: notification_types_1.NotificationType.ASSIGNMENT,
            title: 'Added to Project',
            message: `${assigner.rows[0].name} added you to project "${project.rows[0].name}"`,
            related_id: projectId
        });
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map