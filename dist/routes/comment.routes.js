"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_controller_1 = require("../controllers/comment.controller");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const commentController = new comment_controller_1.CommentController();
router.get('/:id', auth_1.authenticate, commentController.getComment);
router.put('/:id', auth_1.authenticate, [
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'),
    validation_1.validate
], commentController.updateComment);
router.delete('/:id', auth_1.authenticate, commentController.deleteComment);
exports.default = router;
//# sourceMappingURL=comment.routes.js.map