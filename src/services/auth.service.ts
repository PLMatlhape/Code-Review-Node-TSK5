import { query } from '../config/database';
import { CreateUserDto, LoginDto, AuthResponse } from '../types/user.types';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export class AuthService {
  async register(data: CreateUserDto): Promise<AuthResponse> {
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [data.email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('This email is already taken. Try signing in instead.');
    }

    const passwordHash = await hashPassword(data.password);

    const result = await query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, name, role, display_picture, created_at, updated_at`,
      [data.email, passwordHash, data.name, data.role || 'submitter']
    );

    const user = result.rows[0];
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return { user, token };
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [data.email]
    );

    if (result.rows.length === 0) {
      throw new Error('No account found with this email. Please check your email or sign up.');
    }

    const user = result.rows[0];
    const isValidPassword = await comparePassword(data.password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Incorrect password. Please try again.');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const { password_hash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}