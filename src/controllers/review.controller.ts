import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ReviewService } from '../services/review.service';
import { SubmissionService } from '../services/submission.service';

const reviewService = new ReviewService();
const submissionService = new SubmissionService();

export class ReviewController {
  async approveSubmission(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      const review = await reviewService.approveSubmission(id, req.user!.userId, comment);

      res.status(201).json({
        success: true,
        data: review,
        message: 'Submission approved successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async requestChanges(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      if (!comment) {
        return res.status(400).json({
          success: false,
          error: 'Comment is required when requesting changes'
        });
      }

      const review = await reviewService.requestChanges(id, req.user!.userId, comment);

      res.status(201).json({
        success: true,
        data: review,
        message: 'Changes requested successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getReviewHistory(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const canAccess = await submissionService.canAccessSubmission(id, req.user!.userId);

      if (!canAccess) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      const reviews = await reviewService.getReviewHistory(id);

      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getMyReviews(req: AuthRequest, res: Response) {
    try {
      const reviews = await reviewService.getReviewsByReviewer(req.user!.userId);

      res.status(200).json({
        success: true,
        data: reviews
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getReview(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const review = await reviewService.getReviewById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      res.status(200).json({
        success: true,
        data: review
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}