import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class NotificationController {
    getNotifications(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    markAsRead(req: AuthRequest, res: Response): Promise<void>;
    markAllAsRead(req: AuthRequest, res: Response): Promise<void>;
    deleteNotification(req: AuthRequest, res: Response): Promise<void>;
    getProjectStats(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=notification.controller.d.ts.map