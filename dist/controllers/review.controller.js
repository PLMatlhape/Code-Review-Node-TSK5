"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_service_1 = require("../services/review.service");
const submission_service_1 = require("../services/submission.service");
const reviewService = new review_service_1.ReviewService();
const submissionService = new submission_service_1.SubmissionService();
class ReviewController {
    async approveSubmission(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            const review = await reviewService.approveSubmission(id, req.user.userId, comment);
            res.status(201).json({
                success: true,
                data: review,
                message: 'Submission approved successfully'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async requestChanges(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            if (!comment) {
                return res.status(400).json({
                    success: false,
                    error: 'Comment is required when requesting changes'
                });
            }
            const review = await reviewService.requestChanges(id, req.user.userId, comment);
            res.status(201).json({
                success: true,
                data: review,
                message: 'Changes requested successfully'
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
    async getReviewHistory(req, res) {
        try {
            const { id } = req.params;
            const canAccess = await submissionService.canAccessSubmission(id, req.user.userId);
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async getMyReviews(req, res) {
        try {
            const reviews = await reviewService.getReviewsByReviewer(req.user.userId);
            res.status(200).json({
                success: true,
                data: reviews
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async getReview(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}
exports.ReviewController = ReviewController;
//# sourceMappingURL=review.controller.js.map