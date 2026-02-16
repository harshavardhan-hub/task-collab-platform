import express from 'express';
import activityController from '../controllers/activityController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

router.get('/boards/:boardId/activity', activityController.getBoardActivity);
router.get('/activity/recent', activityController.getUserRecentActivity);

export default router;
