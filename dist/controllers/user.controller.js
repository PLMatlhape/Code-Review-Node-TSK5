"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const userService = new user_service_1.UserService();
class UserController {
    async getProfile(req, res) {
        try {
            const userId = req.params.id || req.user.userId;
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'This user profile could not be found.'
                });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.params.id;
            const data = req.body;
            if (userId !== req.user.userId && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'You can only update your own profile.'
                });
            }
            const user = await userService.updateUser(userId, data);
            res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json({
                success: true,
                data: users
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            await userService.deleteUser(userId);
            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
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
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map