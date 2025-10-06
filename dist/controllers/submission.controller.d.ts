import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class SubmissionController {
    createSubmission(req: AuthRequest, res: Response): Promise<void>;
    getSubmission(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getSubmissionsByProject(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getMySubmissions(req: AuthRequest, res: Response): Promise<void>;
    updateSubmission(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateSubmissionStatus(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    deleteSubmission(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=submission.controller.d.ts.map