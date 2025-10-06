import { Review, CreateReviewDto } from '../types/submission.types';
export declare class ReviewService {
    private wsServer?;
    setWebSocketServer(wsServer: any): void;
    createReview(submissionId: string, reviewerId: string, data: CreateReviewDto): Promise<Review>;
    approveSubmission(submissionId: string, reviewerId: string, comment?: string): Promise<Review>;
    requestChanges(submissionId: string, reviewerId: string, comment: string): Promise<Review>;
    getReviewHistory(submissionId: string): Promise<Review[]>;
    getReviewById(reviewId: string): Promise<Review | null>;
    getReviewsByReviewer(reviewerId: string): Promise<Review[]>;
    getLatestReviewForSubmission(submissionId: string): Promise<Review | null>;
}
//# sourceMappingURL=review.service.d.ts.map