import boardService from '../services/boardService.js';

export const boardController = {
  // Create new board
  async createBoard(req, res, next) {
    try {
      const { title, description, backgroundColor } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Board title is required' });
      }

      const board = await boardService.createBoard(
        title,
        description,
        backgroundColor || '#6366F1',
        req.user.id // FIXED: Changed from userId to id
      );

      res.status(201).json({
        message: 'Board created successfully',
        board,
      });
    } catch (error) {
      next(error);
    }
  }, // ← FIXED: Added missing closing brace

  // Get all user boards
  async getUserBoards(req, res, next) {
    try {
      const boards = await boardService.getUserBoards(req.user.id); // FIXED
      res.json({ boards });
    } catch (error) {
      next(error);
    }
  }, // ← FIXED: Added missing closing brace

  // Get board by ID
  async getBoardById(req, res, next) {
    try {
      const { id } = req.params;
      const board = await boardService.getBoardById(parseInt(id), req.user.id); // FIXED

      res.json({ board });
    } catch (error) {
      if (error.message === 'Access denied to this board' || error.message === 'Board not found') {
        return res.status(403).json({ error: error.message });
      }
      next(error);
    }
  }, // ← FIXED: Added missing closing brace

  // Update board
  async updateBoard(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, backgroundColor } = req.body;

      const board = await boardService.updateBoard(parseInt(id), req.user.id, { // FIXED
        title,
        description,
        backgroundColor,
      });

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${id}`).emit('board_updated', { board });
      }

      res.json({
        message: 'Board updated successfully',
        board,
      });
    } catch (error) {
      next(error);
    }
  }, // ← FIXED: Added missing closing brace

  // Delete board
  async deleteBoard(req, res, next) {
    try {
      const { id } = req.params;
      const board = await boardService.deleteBoard(parseInt(id), req.user.id); // FIXED

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${id}`).emit('board_deleted', { boardId: parseInt(id) });
      }

      res.json({
        message: 'Board deleted successfully',
        board,
      });
    } catch (error) {
      next(error);
    }
  }, // ← FIXED: Added missing closing brace

  // Add member to board
  async addMember(req, res, next) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const member = await boardService.addMember(parseInt(id), email, req.user.id); // FIXED

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${id}`).emit('member_added', { member, boardId: parseInt(id) });
      }

      res.json({
        message: 'Member added successfully',
        member,
      });
    } catch (error) {
      next(error);
    }
  }, // ← FIXED: Added missing closing brace
};

export default boardController;
