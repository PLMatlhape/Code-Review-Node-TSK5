import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { NotificationService } from '../services/notification.service';
import { StatsService } from '../services/stats.service';
import { ProjectService } from '../services/project.service';

const notificationService = new NotificationService();
const statsService = new StatsService();
const projectService = new ProjectService();

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id || req.user!.userId;
      const unreadOnly = req.query.unread === 'true';

      if (userId !== req.user!.userId) {
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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await notificationService.markAsRead(id);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      await notificationService.markAllAsRead(req.user!.userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await notificationService.deleteNotification(id);

      res.status(200).json({
        success: true,
        message: 'Notification deleted'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getProjectStats(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const isMember = await projectService.isUserMember(id, req.user!.userId);

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
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}