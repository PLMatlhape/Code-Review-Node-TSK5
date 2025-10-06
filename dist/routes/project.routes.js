"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const submission_controller_1 = require("../controllers/submission.controller");
const notification_controller_1 = require("../controllers/notification.controller");
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const projectController = new project_controller_1.ProjectController();
const submissionController = new submission_controller_1.SubmissionController();
const notificationController = new notification_controller_1.NotificationController();
router.post('/', auth_1.authenticate, [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Project name is required'),
    validation_1.validate
], projectController.createProject);
router.get('/', auth_1.authenticate, projectController.getAllProjects);
router.get('/:id', auth_1.authenticate, projectController.getProject);
router.put('/:id', auth_1.authenticate, [
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Project name cannot be empty'),
    validation_1.validate
], projectController.updateProject);
router.delete('/:id', auth_1.authenticate, projectController.deleteProject);
router.post('/:id/members', auth_1.authenticate, [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('role').optional().isIn(['reviewer', 'submitter']).withMessage('Invalid role'),
    validation_1.validate
], projectController.addMember);
router.delete('/:id/members/:userId', auth_1.authenticate, projectController.removeMember);
router.get('/:id/members', auth_1.authenticate, projectController.getMembers);
router.get('/:id/submissions', auth_1.authenticate, submissionController.getSubmissionsByProject);
router.get('/:id/stats', auth_1.authenticate, notificationController.getProjectStats);
exports.default = router;
//# sourceMappingURL=project.routes.js.map