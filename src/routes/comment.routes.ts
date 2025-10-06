import { Router } from 'express';
import { CommentController } from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();
const commentController = new CommentController();

router.get('/:id', authenticate, commentController.getComment);

router.put(
  '/:id',
  authenticate,
  [
    body('content').notEmpty().withMessage('Content is required'),
    validate
  ],
  commentController.updateComment
);

router.delete('/:id', authenticate, commentController.deleteComment);

export default router;