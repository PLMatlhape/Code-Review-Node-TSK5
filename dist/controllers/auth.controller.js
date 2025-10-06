"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const data = req.body;
            const result = await authService.register(data);
            res.status(201).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async login(req, res) {
        try {
            const data = req.body;
            const result = await authService.login(data);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map