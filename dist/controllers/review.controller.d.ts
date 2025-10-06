import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class ReviewController {
    approveSubmission(req: AuthRequest, res: Response): Promise<void>;
    requestChanges(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReviewHistory(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMyReviews(req: AuthRequest, res: Response): Promise<void>;
    getReview(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=review.controller.d.ts.map