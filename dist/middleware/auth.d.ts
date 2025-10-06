import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authorize: (roles: UserRole | UserRole[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map