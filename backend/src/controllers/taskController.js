import taskService from '../services/taskService.js';

export const taskController = {
  // Create new task
  async createTask(req, res, next) {
    try {
      const { listId } = req.params;
      const { title, description, priority, labels, dueDate } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Task title is required' });
      }

      const task = await taskService.createTask(
        parseInt(listId),
        {
          title,
          description,
          priority: priority || 'medium',
          labels: labels || [],
          dueDate: dueDate || null,
        },
        req.user.id // ← FIXED: Changed from userId to id
      );

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${task.board_id}`).emit('task_created', { task });
      }

      res.status(201).json({
        message: 'Task created successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get task by ID
  async getTaskById(req, res, next) {
    try {
      const { id } = req.params;

      const task = await taskService.getTaskById(parseInt(id), req.user.id); // ← FIXED

      res.json({ task });
    } catch (error) {
      next(error);
    }
  },

  // Update task
  async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, dueDate, priority, labels, attachmentUrl } = req.body;

      const task = await taskService.updateTask(
        parseInt(id),
        { title, description, dueDate, priority, labels, attachmentUrl },
        req.user.id // ← FIXED
      );

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${task.board_id}`).emit('task_updated', { task });
      }

      res.json({
        message: 'Task updated successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  },

  // Move task (drag and drop)
  async moveTask(req, res, next) {
    try {
      const { id } = req.params;
      const { newListId, newPosition } = req.body;

      if (newListId === undefined || newPosition === undefined) {
        return res.status(400).json({ error: 'newListId and newPosition are required' });
      }

      const task = await taskService.moveTask(
        parseInt(id),
        parseInt(newListId),
        parseInt(newPosition),
        req.user.id // ← FIXED
      );

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${task.board_id}`).emit('task_moved', { task, newListId, newPosition });
      }

      res.json({
        message: 'Task moved successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete task
  async deleteTask(req, res, next) {
    try {
      const { id } = req.params;

      const task = await taskService.deleteTask(parseInt(id), req.user.id); // ← FIXED

      // Emit real-time update
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${task.board_id}`).emit('task_deleted', { taskId: parseInt(id) });
      }

      res.json({
        message: 'Task deleted successfully',
        task,
      });
    } catch (error) {
      next(error);
    }
  },

  // Assign user to task
  async assignUser(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      // This now returns the full task with assignees
      const task = await taskService.assignUser(
        parseInt(id),
        req.user.id, // ← FIXED: current user doing the assignment
        userId // ← user being assigned
      );

      // Emit real-time update with full task
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${task.board_id}`).emit('task_assigned', { task });
      }

      res.json({
        message: 'User assigned successfully',
        task, // ← Returns full task with assignees
      });
    } catch (error) {
      next(error);
    }
  },

  // Unassign user from task
  async unassignUser(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      // This now returns the full task with updated assignees
      const task = await taskService.unassignUser(
        parseInt(id),
        req.user.id, // ← FIXED: current user doing the unassignment
        userId // ← user being unassigned
      );

      // Emit real-time update with full task
      const io = req.app.get('io');
      if (io) {
        io.to(`board_${task.board_id}`).emit('task_updated', { task });
      }

      res.json({
        message: 'User unassigned successfully',
        task, // ← Returns full task with updated assignees
      });
    } catch (error) {
      next(error);
    }
  },

  // Search tasks
  async searchTasks(req, res, next) {
    try {
      const { boardId } = req.params;
      const { search, page = 1 } = req.query;

      if (!search) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const result = await taskService.searchTasks(
        parseInt(boardId),
        search,
        parseInt(page)
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};

export default taskController;
