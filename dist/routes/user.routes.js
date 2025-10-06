"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middleware/auth");
const user_types_1 = require("../types/user.types");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
router.get('/me', auth_1.authenticate, userController.getProfile);
router.get('/:id', auth_1.authenticate, userController.getProfile);
router.put('/:id', auth_1.authenticate, userController.updateProfile);
router.get('/', auth_1.authenticate, userController.getAllUsers);
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(user_types_1.UserRole.ADMIN), userController.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map