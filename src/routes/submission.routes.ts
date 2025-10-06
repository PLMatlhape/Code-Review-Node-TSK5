import { Router } from 'express';
import { SubmissionController } from '../controllers/submission.controller';
import { CommentController } from '../controllers/comment.controller';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();
const submissionController = new SubmissionController();
const commentController = new CommentController();
const reviewController = new ReviewController();

router.post(
  '/',
  authenticate,
  [
    body('project_id').notEmpty().withMessage('Project ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('code_content').notEmpty().withMessage('Code content is required'),
    validate
  ],
  submissionController.createSubmission
);

router.get('/my-submissions', authenticate, submissionController.getMySubmissions);
router.get('/:id', authenticate, submissionController.getSubmission);

router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('code_content').optional().notEmpty().withMessage('Code content cannot be empty'),
    validate
  ],
  submissionController.updateSubmission
);

router.patch(
  '/:id/status',
  authenticate,
  [
    body('status').isIn(['pending', 'in_review', 'approved', 'changes_requested']).withMessage('Invalid status'),
    validate
  ],
  submissionController.updateSubmissionStatus
);

router.delete('/:id', authenticate, submissionController.deleteSubmission);

// Comment routes
router.post(
  '/:id/comments',
  authenticate,
  [
    body('content').notEmpty().withMessage('Content is required'),
    body('line_number').optional().isInt({ min: 1 }).withMessage('Line number must be positive integer'),
    validate
  ],
  commentController.createComment
);

router.get('/:id/comments', authenticate, commentController.getComments);

// Review routes
router.post(
  '/:id/approve',
  authenticate,
  [
    body('comment').optional().isString(),
    validate
  ],
  reviewController.approveSubmission
);

router.post(
  '/:id/request-changes',
  authenticate,
  [
    body('comment').notEmpty().withMessage('Comment is required'),
    validate
  ],
  reviewController.requestChanges
);

router.get('/:id/reviews', authenticate, reviewController.getReviewHistory);

export default router;