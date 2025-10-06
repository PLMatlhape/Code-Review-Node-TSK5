import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { UserRole } from '../types/user.types';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Please log in to access this feature.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Your session has expired. Please log in again.'
    });
  }
};

export const authorize = (roles: UserRole | UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Please log in to continue.'
      });
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (allowedRoles.indexOf(req.user.role as UserRole) === -1) {
      return res.status(403).json({
        success: false,
        error: 'You don\'t have permission to perform this action.'
      });
    }

    next();
  };
};
