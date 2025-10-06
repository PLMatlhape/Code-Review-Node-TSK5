import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare class AuthController {
    register(req: AuthRequest, res: Response): Promise<void>;
    login(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map