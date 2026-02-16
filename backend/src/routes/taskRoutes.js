import express from 'express';
import taskController from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// Task CRUD
router.post('/lists/:listId/tasks', taskController.createTask);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Task operations
router.put('/tasks/:id/move', taskController.moveTask);
router.post('/tasks/:id/assign', taskController.assignUser);
router.post('/tasks/:id/unassign', taskController.unassignUser);

// Search tasks
router.get('/tasks/boards/:boardId/search', taskController.searchTasks);

export default router;
