"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const notificationController = new notification_controller_1.NotificationController();
router.get('/me', auth_1.authenticate, notificationController.getNotifications);
router.get('/:id', auth_1.authenticate, notificationController.getNotifications);
router.patch('/:id/read', auth_1.authenticate, notificationController.markAsRead);
router.patch('/mark-all-read', auth_1.authenticate, notificationController.markAllAsRead);
router.delete('/:id', auth_1.authenticate, notificationController.deleteNotification);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map