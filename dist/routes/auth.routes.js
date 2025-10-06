"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Please enter your full name'),
    validation_1.validate
], authController.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email address'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Please enter your password'),
    validation_1.validate
], authController.login);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map