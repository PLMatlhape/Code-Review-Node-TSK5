"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const stats_service_1 = require("../services/stats.service");
const project_service_1 = require("../services/project.service");
const notificationService = new notification_service_1.NotificationService();
const statsService = new stats_service_1.StatsService();
const projectService = new project_service_1.ProjectService();
class NotificationController {
    async getNotifications(req, res) {
        try {
            const userId = req.params.id || req.user.userId;
            const unreadOnly = req.query.unread === 'true';
            if (userId !== req.user.userId) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied'
                });
            }
            const notifications = await notificationService.getUserNotifications(userId, unreadOnly);
            const unreadCount = await notificationService.getUnreadCount(userId);
            res.status(200).json({
                success: true,
                data: {
                    notifications,
                    unread_count: unreadCount
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await notificationService.markAsRead(id);
            res.status(200).json({
                success: true,
                message: 'Notification marked as read'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async markAllAsRead(req, res) {
        try {
            await notificationService.markAllAsRead(req.user.userId);
            res.status(200).json({
                success: true,
                message: 'All notifications marked as read'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async deleteNotification(req, res) {
        try {
            const { id } = req.params;
            await notificationService.deleteNotification(id);
            res.status(200).json({
                success: true,
                message: 'Notification deleted'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async getProjectStats(req, res) {
        try {
            const { id } = req.params;
            const isMember = await projectService.isUserMember(id, req.user.userId);
            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied'
                });
            }
            const stats = await statsService.getProjectStats(id);
            res.status(200).json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map