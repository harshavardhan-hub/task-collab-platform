import listService from '../services/listService.js';

export const listController = {
  // Create new list
  async createList(req, res, next) {
    try {
      const { boardId } = req.params;
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'List title is required' });
      }

      const list = await listService.createList(parseInt(boardId), title, req.user.id); // ← FIXED

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${boardId}`).emit('list_created', { list });
      }

      res.status(201).json({
        message: 'List created successfully',
        list,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update list
  async updateList(req, res, next) {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const list = await listService.updateList(parseInt(id), { title }, req.user.id); // ← FIXED

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${list.board_id}`).emit('list_updated', { list });
      }

      res.json({
        message: 'List updated successfully',
        list,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete list
  async deleteList(req, res, next) {
    try {
      const { id } = req.params;

      const list = await listService.deleteList(parseInt(id), req.user.id); // ← FIXED

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${list.board_id}`).emit('list_deleted', { listId: parseInt(id) });
      }

      res.json({
        message: 'List deleted successfully',
        list,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default listController;
