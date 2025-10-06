import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../types/user.types';

const userService = new UserService();

export class UserController {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id || req.user!.userId;
      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'This user profile could not be found.'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id;
      const data: UpdateUserDto = req.body;

      if (userId !== req.user!.userId && req.user!.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'You can only update your own profile.'
        });
      }

      const user = await userService.updateUser(userId, data);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await userService.getAllUsers();

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const userId = req.params.id;

      await userService.deleteUser(userId);

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}