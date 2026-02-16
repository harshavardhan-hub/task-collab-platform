import express from 'express';
import listController from '../controllers/listController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

router.post('/boards/:boardId/lists', listController.createList);
router.put('/lists/:id', listController.updateList);
router.delete('/lists/:id', listController.deleteList);

export default router;
