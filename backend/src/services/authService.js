import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const SALT_ROUNDS = 10;

export const authService = {
  // Register new user
  async register(email, password, fullName) {
    try {
      // Check if user already exists
      const existingUser = await query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Insert new user
      const result = await query(
        `INSERT INTO users (email, password_hash, full_name) 
         VALUES ($1, $2, $3) 
         RETURNING id, email, full_name, avatar_url, created_at`,
        [email, passwordHash, fullName]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Login user
  async login(email, password) {
    try {
      // Find user by email
      const result = await query(
        'SELECT id, email, password_hash, full_name, avatar_url FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = result.rows[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);

      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Remove password hash from response
      delete user.password_hash;

      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const result = await query(
        'SELECT id, email, full_name, avatar_url, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('User not found');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const { fullName, avatarUrl } = updates;
      const result = await query(
        `UPDATE users 
         SET full_name = COALESCE($1, full_name), 
             avatar_url = COALESCE($2, avatar_url)
         WHERE id = $3 
         RETURNING id, email, full_name, avatar_url`,
        [fullName, avatarUrl, userId]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
