import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types/user.types';

const router = Router();
const userController = new UserController();

router.get('/me', authenticate, userController.getProfile);
router.get('/:id', authenticate, userController.getProfile);
router.put('/:id', authenticate, userController.updateProfile);
router.get('/', authenticate, userController.getAllUsers);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), userController.deleteUser);

export default router;