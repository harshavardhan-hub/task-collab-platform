import { query, getClient } from '../config/database.js';

export const listService = {
  // Create new list
  async createList(boardId, title, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Get next position
      const positionResult = await client.query(
        'SELECT COALESCE(MAX(position), -1) + 1 as next_position FROM lists WHERE board_id = $1',
        [boardId]
      );

      const position = positionResult.rows[0].next_position;

      // Create list
      const listResult = await client.query(
        `INSERT INTO lists (board_id, title, position) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [boardId, title, position]
      );

      const list = listResult.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [boardId, userId, 'list_created', 'list', list.id, JSON.stringify({ title })]
      );

      await client.query('COMMIT');
      return list;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Update list
  async updateList(listId, updates, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const { title } = updates;

      const result = await client.query(
        `UPDATE lists 
         SET title = COALESCE($1, title)
         WHERE id = $2
         RETURNING *`,
        [title, listId]
      );

      if (result.rows.length === 0) {
        throw new Error('List not found');
      }

      const list = result.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [list.board_id, userId, 'list_updated', 'list', list.id, JSON.stringify({ title })]
      );

      await client.query('COMMIT');
      return list;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // Delete list
  async deleteList(listId, userId) {
    const client = await getClient();
    try {
      await client.query('BEGIN');

      const result = await client.query(
        'DELETE FROM lists WHERE id = $1 RETURNING *',
        [listId]
      );

      if (result.rows.length === 0) {
        throw new Error('List not found');
      }

      const list = result.rows[0];

      // Log activity
      await client.query(
        `INSERT INTO activity_logs (board_id, user_id, action, entity_type, entity_id, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [list.board_id, userId, 'list_deleted', 'list', list.id, JSON.stringify({ title: list.title })]
      );

      await client.query('COMMIT');
      return list;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};

export default listService;
