import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const reviewController = new ReviewController();

router.get('/my-reviews', authenticate, reviewController.getMyReviews);
router.get('/:id', authenticate, reviewController.getReview);

export default router;