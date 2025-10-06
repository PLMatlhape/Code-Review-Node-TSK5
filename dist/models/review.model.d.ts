import { Review, CreateReviewDto } from '../types/submission.types';
export declare class ReviewModel {
    static create(submissionId: string, reviewerId: string, data: CreateReviewDto): Promise<Review>;
    static findById(id: string): Promise<Review | null>;
    static findBySubmission(submissionId: string): Promise<Review[]>;
    static findByReviewer(reviewerId: string): Promise<Review[]>;
    static findLatestForSubmission(submissionId: string): Promise<Review | null>;
    static delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=review.model.d.ts.map