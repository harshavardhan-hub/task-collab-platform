import { query, getClient } from '../config/database.js';

export const taskService = {
  // Create new task
  async createTask(listId, data, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const { title, description, priority, labels, dueDate } = data;

      // Get list info and next position
      const listResult = await client.query(
        'SELECT board_id FROM lists WHERE id = $1',
        [listId]
      );

      if (listResult.rows.length === 0) {
        throw new Error('List not found');
      }

      const boardId = listResult.rows[0].board_id;

      const positionResult = await client.query(
        'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM tasks WHERE list_id = $1',
        [listId]
      );

      const position = positionResult.rows[0].next_position;

      // Create task
      const taskResult = await client.query(
        `INSERT INTO tasks (list_id, board_id, title, description, priority, labels, due_date, position, created_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [listId, boardId, title, description || '', priority || 'medium', labels || '{}', dueDate, position, userId]
      );

      const task = taskResult.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [boardId, userId, 'task_created', 'task', task.id, JSON.stringify({ title })]
      );

      await client.query('COMMIT');
      
      // Return task with empty assignees array
      return { ...task, assignees: [] };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Get task by ID with full details
  async getTaskById(taskId, userId) {
    try {
      const result = await query(
        `SELECT t.*, 
                u.full_name as creator_name,
                COALESCE(
                  json_agg(
                    json_build_object(
                      'id', assignee.id,
                      'email', assignee.email,
                      'full_name', assignee.full_name,
                      'avatar_url', assignee.avatar_url
                    )
                  ) FILTER (WHERE assignee.id IS NOT NULL),
                  '[]'
                ) as assignees
         FROM tasks t
         LEFT JOIN users u ON t.created_by = u.id
         LEFT JOIN task_assignments ta ON t.id = ta.task_id
         LEFT JOIN users assignee ON ta.user_id = assignee.id
         WHERE t.id = $1
         GROUP BY t.id, u.full_name`,
        [taskId]
      );

      if (result.rows.length === 0) {
        throw new Error('Task not found');
      }

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Update task
  async updateTask(taskId, updates, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const { title, description, dueDate, priority, labels, attachmentUrl } = updates;

      const result = await client.query(
        `UPDATE tasks 
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             due_date = $3,
             priority = COALESCE($4, priority),
             labels = COALESCE($5, labels),
             attachment_url = COALESCE($6, attachment_url),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7
         RETURNING *`,
        [title, description, dueDate, priority, labels, attachmentUrl, taskId]
      );

      if (result.rows.length === 0) {
        throw new Error('Task not found');
      }

      const task = result.rows[0];

      // Get assignees
      const assigneesResult = await client.query(
        `SELECT u.id, u.email, u.full_name, u.avatar_url
         FROM task_assignments ta
         JOIN users u ON ta.user_id = u.id
         WHERE ta.task_id = $1`,
        [taskId]
      );

      task.assignees = assigneesResult.rows;

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [task.board_id, userId, 'task_updated', 'task', task.id, JSON.stringify({ title: task.title })]
      );

      await client.query('COMMIT');
      return task;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Move task
  async moveTask(taskId, newListId, newPosition, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const taskResult = await client.query(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
      );

      if (taskResult.rows.length === 0) {
        throw new Error('Task not found');
      }

      const task = taskResult.rows[0];
      const oldListId = task.list_id;

      await client.query(
        `UPDATE tasks 
         SET list_id = $1, position = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [newListId, newPosition, taskId]
      );

      await client.query(
        `UPDATE tasks 
         SET position = position - 1
         WHERE list_id = $1 AND position > $2 AND id != $3`,
        [oldListId, task.position, taskId]
      );

      await client.query(
        `UPDATE tasks 
         SET position = position + 1
         WHERE list_id = $1 AND position >= $2 AND id != $3`,
        [newListId, newPosition, taskId]
      );

      const updatedResult = await client.query(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
      );

      const updatedTask = updatedResult.rows[0];

      // Get assignees
      const assigneesResult = await client.query(
        `SELECT u.id, u.email, u.full_name, u.avatar_url
         FROM task_assignments ta
         JOIN users u ON ta.user_id = u.id
         WHERE ta.task_id = $1`,
        [taskId]
      );

      updatedTask.assignees = assigneesResult.rows;

      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          updatedTask.board_id,
          userId,
          'task_moved',
          'task',
          taskId,
          JSON.stringify({ title: updatedTask.title, oldListId, newListId }),
        ]
      );

      await client.query('COMMIT');
      return updatedTask;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Delete task
  async deleteTask(taskId, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const taskCheck = await client.query(
        `SELECT t.*, l.board_id 
         FROM tasks t
         INNER JOIN lists l ON t.list_id = l.id
         INNER JOIN board_members bm ON l.board_id = bm.board_id
         WHERE t.id = $1 AND bm.user_id = $2`,
        [taskId, userId]
      );

      if (taskCheck.rows.length === 0) {
        throw new Error('Task not found or access denied');
      }

      const task = taskCheck.rows[0];

      await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);

      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [task.board_id, userId, 'task_deleted', 'task', taskId, JSON.stringify({ title: task.title })]
      );

      await client.query('COMMIT');
      return task;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Assign user to task
  async assignUser(taskId, userId, userIdToAssign) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const taskResult = await client.query(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
      );

      if (taskResult.rows.length === 0) {
        throw new Error('Task not found');
      }

      const task = taskResult.rows[0];

      await client.query(
        `INSERT INTO task_assignments (task_id, user_id) 
         VALUES ($1, $2)
         ON CONFLICT (task_id, user_id) DO NOTHING`,
        [taskId, userIdToAssign]
      );

      // Get user details
      const userResult = await client.query(
        'SELECT id, email, full_name, avatar_url FROM users WHERE id = $1',
        [userIdToAssign]
      );

      const assignedUser = userResult.rows[0];

      // Get full task with all assignees
      const fullTaskResult = await client.query(
        `SELECT t.*, 
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
         WHERE t.id = $1
         GROUP BY t.id`,
        [taskId]
      );

      const fullTask = fullTaskResult.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          task.board_id,
          userId,
          'user_assigned',
          'task',
          taskId,
          JSON.stringify({ assignedUser: assignedUser.full_name, taskTitle: task.title }),
        ]
      );

      await client.query('COMMIT');
      return fullTask;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Unassign user from task
  async unassignUser(taskId, userId, userIdToUnassign) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const taskResult = await client.query(
        'SELECT * FROM tasks WHERE id = $1',
        [taskId]
      );

      if (taskResult.rows.length === 0) {
        throw new Error('Task not found');
      }

      const task = taskResult.rows[0];

      await client.query(
        'DELETE FROM task_assignments WHERE task_id = $1 AND user_id = $2',
        [taskId, userIdToUnassign]
      );

      // Get full task with remaining assignees
      const fullTaskResult = await client.query(
        `SELECT t.*, 
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
         WHERE t.id = $1
         GROUP BY t.id`,
        [taskId]
      );

      const fullTask = fullTaskResult.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [task.board_id, userId, 'user_unassigned', 'task', taskId, JSON.stringify({ taskTitle: task.title })]
      );

      await client.query('COMMIT');
      return fullTask;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Search tasks
  async searchTasks(boardId, searchQuery, page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;

      const result = await query(
        `SELECT t.*, l.title as list_title,
                COALESCE(
                  json_agg(
                    json_build_object('id', u.id, 'full_name', u.full_name, 'avatar_url', u.avatar_url)
                  ) FILTER (WHERE u.id IS NOT NULL),
                  '[]'
                ) as assignees
         FROM tasks t
         LEFT JOIN lists l ON t.list_id = l.id
         LEFT JOIN task_assignments ta ON t.id = ta.task_id
         LEFT JOIN users u ON ta.user_id = u.id
         WHERE t.board_id = $1 
         AND (t.title ILIKE $2 OR t.description ILIKE $2)
         GROUP BY t.id, l.title
         ORDER BY t.updated_at DESC
         LIMIT $3 OFFSET $4`,
        [boardId, `%${searchQuery}%`, limit, offset]
      );

      const countResult = await query(
        `SELECT COUNT(*) as total
         FROM tasks
         WHERE board_id = $1 
         AND (title ILIKE $2 OR description ILIKE $2)`,
        [boardId, `%${searchQuery}%`]
      );

      return {
        tasks: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        totalPages: Math.ceil(countResult.rows[0].total / limit),
      };
    } catch (error) {
      throw error;
    }
  },
};

export default taskService;
