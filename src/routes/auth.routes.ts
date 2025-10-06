import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { body } from 'express-validator';
import { validate } from '../middleware/validation';

const router = Router();
const authController = new AuthController();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Please enter your full name'),
    validate
  ],
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Please enter your password'),
    validate
  ],
  authController.login
);

export default router;