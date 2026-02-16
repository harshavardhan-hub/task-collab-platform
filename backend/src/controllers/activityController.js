import activityService from '../services/activityService.js';

export const activityController = {
  // Get board activity logs
  async getBoardActivity(req, res, next) {
    try {
      const { boardId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const result = await activityService.getBoardActivity(
        parseInt(boardId),
        parseInt(page),
        parseInt(limit)
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Get user's recent activity across all boards
  async getUserRecentActivity(req, res, next) {
    try {
      const { limit = 20 } = req.query;

      const activities = await activityService.getUserRecentActivity(
        req.user.id, // ← FIXED
        parseInt(limit)
      );

      res.json({ activities });
    } catch (error) {
      next(error);
    }
  },
};

export default activityController;
