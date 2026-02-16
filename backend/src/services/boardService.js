import { query, getClient } from '../config/database.js';

export const boardService = {
  // Create new board
  async createBoard(title, description, backgroundColor, ownerId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Create board
      const boardResult = await client.query(
        `INSERT INTO boards (title, description, background_color, owner_id) 
         VALUES ($1, $2, $3, $4) 
         RETURNING *`,
        [title, description, backgroundColor, ownerId]
      );

      const board = boardResult.rows[0];

      // Add owner as board member
      await client.query(
        `INSERT INTO board_members (board_id, user_id, role) 
         VALUES ($1, $2, $3)`,
        [board.id, ownerId, 'owner']
      );

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [board.id, ownerId, 'board_created', 'board', board.id, JSON.stringify({ title })]
      );

      await client.query('COMMIT');
      return board;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }, // ← FIXED: Added missing closing brace

  // Get all boards for user
  async getUserBoards(userId) {
    try {
      const result = await query(
        `SELECT b.*, u.full_name as owner_name, u.avatar_url as owner_avatar,
                COUNT(DISTINCT l.id) as list_count,
                COUNT(DISTINCT t.id) as task_count
         FROM boards b
         INNER JOIN board_members bm ON b.id = bm.board_id
         LEFT JOIN users u ON b.owner_id = u.id
         LEFT JOIN lists l ON b.id = l.board_id
         LEFT JOIN tasks t ON b.id = t.board_id
         WHERE bm.user_id = $1
         GROUP BY b.id, u.full_name, u.avatar_url
         ORDER BY b.updated_at DESC`,
        [userId]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  }, // ← FIXED: Added missing closing brace

  // Get board by ID with members
  async getBoardById(boardId, userId) {
    try {
      // Check if user is a member
      const memberCheck = await query(
        'SELECT id FROM board_members WHERE board_id = $1 AND user_id = $2',
        [boardId, userId]
      );

      if (memberCheck.rows.length === 0) {
        throw new Error('Access denied to this board');
      }

      // Get board details
      const boardResult = await query(
        `SELECT b.*, u.full_name as owner_name, u.avatar_url as owner_avatar
         FROM boards b
         LEFT JOIN users u ON b.owner_id = u.id
         WHERE b.id = $1`,
        [boardId]
      );

      if (boardResult.rows.length === 0) {
        throw new Error('Board not found');
      }

      const board = boardResult.rows[0];

      // Get board members
      const membersResult = await query(
        `SELECT u.id, u.email, u.full_name, u.avatar_url, bm.role
         FROM board_members bm
         INNER JOIN users u ON bm.user_id = u.id
         WHERE bm.board_id = $1`,
        [boardId]
      );

      board.members = membersResult.rows;

      // Get lists with tasks
      const listsResult = await query(
        `SELECT l.* 
         FROM lists l
         WHERE l.board_id = $1
         ORDER BY l.position ASC`,
        [boardId]
      );

      board.lists = listsResult.rows;

      // Get tasks for each list
      for (let list of board.lists) {
        const tasksResult = await query(
          `SELECT t.id, t.list_id, t.title, t.description, t.priority, t.labels, 
                  t.due_date, t.attachment_url, t.position, t.created_at, t.updated_at,
                  COALESCE(
                    json_agg(
                      json_build_object(
                        'id', u.id,
                        'email', u.email,
                        'full_name', u.full_name,
                        'avatar_url', u.avatar_url
                      )
                    ) FILTER (WHERE u.id IS NOT NULL),
                    '[]'
                  ) as assignees
           FROM tasks t
           LEFT JOIN task_assignments ta ON t.id = ta.task_id
           LEFT JOIN users u ON ta.user_id = u.id
           WHERE t.list_id = $1
           GROUP BY t.id
           ORDER BY t.position ASC`,
          [list.id]
        );

        list.tasks = tasksResult.rows;
      }

      return board;
    } catch (error) {
      console.error('Error in getBoardById:', error);
      throw error;
    }
  }, // ← FIXED: Added missing closing brace

  // Update board
  async updateBoard(boardId, userId, updates) {
    try {
      const { title, description, backgroundColor } = updates;

      const result = await query(
        `UPDATE boards 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             background_color = COALESCE($3, background_color),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $4 AND owner_id = $5
         RETURNING *`,
        [title, description, backgroundColor, boardId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Board not found or access denied');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }, // ← FIXED: Added missing closing brace

  // Delete board
  async deleteBoard(boardId, userId) {
    try {
      const result = await query(
        'DELETE FROM boards WHERE id = $1 AND owner_id = $2 RETURNING *',
        [boardId, userId]
      );

      if (result.rows.length === 0) {
        throw new Error('Board not found or access denied');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }, // ← FIXED: Added missing closing brace

  // Add member to board
  async addMember(boardId, email, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Check if requester is owner
      const ownerCheck = await client.query(
        'SELECT id FROM boards WHERE id = $1 AND owner_id = $2',
        [boardId, userId]
      );

      if (ownerCheck.rows.length === 0) {
        throw new Error('Only board owner can add members');
      }

      // Find user by email
      const userResult = await client.query(
        'SELECT id, email, full_name FROM users WHERE email = $1',
        [email]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found with this email');
      }

      const newMember = userResult.rows[0];

      // Check if already a member
      const existingMember = await client.query(
        'SELECT id FROM board_members WHERE board_id = $1 AND user_id = $2',
        [boardId, newMember.id]
      );

      if (existingMember.rows.length > 0) {
        throw new Error('User is already a member of this board');
      }

      // Add as board member
      await client.query(
        `INSERT INTO board_members (board_id, user_id, role) 
         VALUES ($1, $2, $3)`,
        [boardId, newMember.id, 'member']
      );

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [boardId, userId, 'member_added', 'board', boardId, JSON.stringify({ memberEmail: email })]
      );

      await client.query('COMMIT');
      return newMember;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }, 
};

export default boardService;
