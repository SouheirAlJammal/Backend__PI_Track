import express from 'express';
import { getTaskStatistics, getPlansWithProgress } from '../controllers/userStatistics.js';
import { isAuthenticated, isAuthorizedUser} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/taskStatistics',isAuthenticated, getTaskStatistics);
router.get('/plansWithProgress',isAuthenticated, getPlansWithProgress);

export default router;
