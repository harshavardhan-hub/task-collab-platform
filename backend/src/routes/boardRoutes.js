import express from 'express';
import boardController from '../controllers/boardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(authenticateToken);

// FIXED: Added /boards prefix to all routes
router.post('/boards', boardController.createBoard);
router.get('/boards', boardController.getUserBoards);
router.get('/boards/:id', boardController.getBoardById);
router.put('/boards/:id', boardController.updateBoard);
router.delete('/boards/:id', boardController.deleteBoard);
router.post('/boards/:id/members', boardController.addMember);

export default router;
