import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { SubmissionController } from '../controllers/submission.controller';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();
const projectController = new ProjectController();
const submissionController = new SubmissionController();
const notificationController = new NotificationController();

router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Project name is required'),
    validate
  ],
  projectController.createProject
);

router.get('/', authenticate, projectController.getAllProjects);
router.get('/:id', authenticate, projectController.getProject);

router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().notEmpty().withMessage('Project name cannot be empty'),
    validate
  ],
  projectController.updateProject
);

router.delete('/:id', authenticate, projectController.deleteProject);

router.post(
  '/:id/members',
  authenticate,
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('role').optional().isIn(['reviewer', 'submitter']).withMessage('Invalid role'),
    validate
  ],
  projectController.addMember
);

router.delete('/:id/members/:userId', authenticate, projectController.removeMember);
router.get('/:id/members', authenticate, projectController.getMembers);

router.get('/:id/submissions', authenticate, submissionController.getSubmissionsByProject);

router.get('/:id/stats', authenticate, notificationController.getProjectStats);

export default router;