"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const submission_controller_1 = require("../controllers/submission.controller");
const comment_controller_1 = require("../controllers/comment.controller");
const review_controller_1 = require("../controllers/review.controller");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const submissionController = new submission_controller_1.SubmissionController();
const commentController = new comment_controller_1.CommentController();
const reviewController = new review_controller_1.ReviewController();
router.post('/', auth_1.authenticate, [
    (0, express_validator_1.body)('project_id').notEmpty().withMessage('Project ID is required'),
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('code_content').notEmpty().withMessage('Code content is required'),
    validation_1.validate
], submissionController.createSubmission);
router.get('/my-submissions', auth_1.authenticate, submissionController.getMySubmissions);
router.get('/:id', auth_1.authenticate, submissionController.getSubmission);
router.put('/:id', auth_1.authenticate, [
    (0, express_validator_1.body)('title').optional().notEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('code_content').optional().notEmpty().withMessage('Code content cannot be empty'),
    validation_1.validate
], submissionController.updateSubmission);
router.patch('/:id/status', auth_1.authenticate, [
    (0, express_validator_1.body)('status').isIn(['pending', 'in_review', 'approved', 'changes_requested']).withMessage('Invalid status'),
    validation_1.validate
], submissionController.updateSubmissionStatus);
router.delete('/:id', auth_1.authenticate, submissionController.deleteSubmission);
// Comment routes
router.post('/:id/comments', auth_1.authenticate, [
    (0, express_validator_1.body)('content').notEmpty().withMessage('Content is required'),
    (0, express_validator_1.body)('line_number').optional().isInt({ min: 1 }).withMessage('Line number must be positive integer'),
    validation_1.validate
], commentController.createComment);
router.get('/:id/comments', auth_1.authenticate, commentController.getComments);
// Review routes
router.post('/:id/approve', auth_1.authenticate, [
    (0, express_validator_1.body)('comment').optional().isString(),
    validation_1.validate
], reviewController.approveSubmission);
router.post('/:id/request-changes', auth_1.authenticate, [
    (0, express_validator_1.body)('comment').notEmpty().withMessage('Comment is required'),
    validation_1.validate
], reviewController.requestChanges);
router.get('/:id/reviews', auth_1.authenticate, reviewController.getReviewHistory);
exports.default = router;
//# sourceMappingURL=submission.routes.js.map