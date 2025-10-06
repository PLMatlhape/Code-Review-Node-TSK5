import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class CommentController {
    createComment(req: AuthRequest, res: Response): Promise<void>;
    getComments(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateComment(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteComment(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getComment(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=comment.controller.d.ts.map