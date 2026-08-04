import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { dashboard } from '../controllers/dashboardController.js';
const router=Router(); router.get('/', protect, dashboard); export default router;
