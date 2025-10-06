import { Notification, CreateNotificationDto } from '../types/notification.types';
export declare class NotificationService {
    createNotification(data: CreateNotificationDto): Promise<Notification>;
    getUserNotifications(userId: string, unreadOnly?: boolean): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    deleteNotification(notificationId: string): Promise<void>;
    notifyComment(submissionId: string, commenterId: string, submitterId: string): Promise<void>;
    notifyReview(submissionId: string, reviewerId: string, submitterId: string, status: string): Promise<void>;
    notifyProjectAssignment(projectId: string, userId: string, assignedBy: string): Promise<void>;
}
//# sourceMappingURL=notification.service.d.ts.map