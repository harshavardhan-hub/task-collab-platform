import authService from '../services/authService.js';
import { logger } from '../utils/logger.js';

export const authController = {
  // Register new user
  async register(req, res, next) {
    try {
      const { email, password, fullName } = req.body;

      // Validation
      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const user = await authService.register(email, password, fullName);

      logger.info('User registered successfully', { userId: user.id });

      res.status(201).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error) {
      if (error.message === 'User already exists with this email') {
        return res.status(409).json({ error: error.message });
      }
      next(error);
    }
  },

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { user, token } = await authService.login(email, password);

      logger.info('User logged in successfully', { userId: user.id });

      res.json({
        message: 'Login successful',
        user,
        token,
      });
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({ error: error.message });
      }
      next(error);
    }
  },

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const user = await authService.getUserProfile(req.user.id); // ← FIXED: Changed from userId to id
      res.json({ user });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const { fullName, avatarUrl } = req.body;

      const user = await authService.updateProfile(req.user.id, { // ← FIXED: Changed from userId to id
        fullName,
        avatarUrl,
      });

      logger.info('User profile updated', { userId: user.id });

      res.json({
        message: 'Profile updated successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
