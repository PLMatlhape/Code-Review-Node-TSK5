import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class UserController {
    getProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateProfile(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAllUsers(req: AuthRequest, res: Response): Promise<void>;
    deleteUser(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map