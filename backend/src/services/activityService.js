import { query } from '../config/database.js';

export const activityService = {
  // Get activity logs for a board
  async getBoardActivity(boardId, page = 1, limit = 50) {
    try {
      const offset = (page - 1) * limit;

      const result = await query(
        `SELECT al.*, u.full_name as user_name, u.avatar_url as user_avatar
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         WHERE al.board_id = $1
         ORDER BY al.created_at DESC
         LIMIT $2 OFFSET $3`,
        [boardId, limit, offset]
      );

      // Get total count
      const countResult = await query(
        'SELECT COUNT(*) as total FROM activity_logs WHERE board_id = $1',
        [boardId]
      );

      return {
        activities: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        totalPages: Math.ceil(countResult.rows[0].total / limit),
      };
    } catch (error) {
      throw error;
    }
  },

  // Get recent activities across all user's boards
  async getUserRecentActivity(userId, limit = 20) {
    try {
      const result = await query(
        `SELECT al.*, u.full_name as user_name, u.avatar_url as user_avatar, b.title as board_title
         FROM activity_logs al
         LEFT JOIN users u ON al.user_id = u.id
         LEFT JOIN boards b ON al.board_id = b.id
         WHERE al.board_id IN (
           SELECT board_id FROM board_members WHERE user_id = $1
         )
         ORDER BY al.created_at DESC
         LIMIT $2`,
        [userId, limit]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

export default activityService;
