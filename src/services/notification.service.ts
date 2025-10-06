import { query } from '../config/database';
import { Notification, CreateNotificationDto, NotificationType } from '../types/notification.types';

export class NotificationService {
  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    const result = await query(
      `INSERT INTO notifications (user_id, type, title, message, related_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [data.user_id, data.type, data.title, data.message, data.related_id]
    );

    return result.rows[0];
  }

  async getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    let queryText = `SELECT * FROM notifications WHERE user_id = $1`;
    
    if (unreadOnly) {
      queryText += ` AND is_read = false`;
    }

    queryText += ` ORDER BY created_at DESC LIMIT 50`;

    const result = await query(queryText, [userId]);
    return result.rows;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await query(
      'UPDATE notifications SET is_read = true WHERE id = $1',
      [notificationId]
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    );

    return parseInt(result.rows[0].count);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await query('DELETE FROM notifications WHERE id = $1', [notificationId]);
  }

  async notifyComment(submissionId: string, commenterId: string, submitterId: string): Promise<void> {
    const submission = await query('SELECT title FROM submissions WHERE id = $1', [submissionId]);
    const commenter = await query('SELECT name FROM users WHERE id = $1', [commenterId]);

    if (commenterId !== submitterId) {
      await this.createNotification({
        user_id: submitterId,
        type: NotificationType.COMMENT,
        title: 'New Comment',
        message: `${commenter.rows[0].name} commented on your submission "${submission.rows[0].title}"`,
        related_id: submissionId
      });
    }
  }

  async notifyReview(submissionId: string, reviewerId: string, submitterId: string, status: string): Promise<void> {
    const submission = await query('SELECT title FROM submissions WHERE id = $1', [submissionId]);
    const reviewer = await query('SELECT name FROM users WHERE id = $1', [reviewerId]);

    const statusText = status === 'approved' ? 'approved' : 'requested changes for';

    await this.createNotification({
      user_id: submitterId,
      type: NotificationType.REVIEW,
      title: 'Review Received',
      message: `${reviewer.rows[0].name} ${statusText} your submission "${submission.rows[0].title}"`,
      related_id: submissionId
    });
  }

  async notifyProjectAssignment(projectId: string, userId: string, assignedBy: string): Promise<void> {
    const project = await query('SELECT name FROM projects WHERE id = $1', [projectId]);
    const assigner = await query('SELECT name FROM users WHERE id = $1', [assignedBy]);

    await this.createNotification({
      user_id: userId,
      type: NotificationType.ASSIGNMENT,
      title: 'Added to Project',
      message: `${assigner.rows[0].name} added you to project "${project.rows[0].name}"`,
      related_id: projectId
    });
  }
}