import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, LoginDto } from '../types/user.types';

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response) {
    try {
      const data: CreateUserDto = req.body;
      const result = await authService.register(data);

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const data: LoginDto = req.body;
      const result = await authService.login(data);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }
}