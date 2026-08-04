import { Router } from 'express';
import { z } from 'zod';
import { login, me } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
const router = Router();
router.post('/login', validate(z.object({ body: z.object({ email: z.string().email(), password: z.string().min(8) }), params: z.any(), query: z.any() })), login);
router.get('/me', protect, me);
export default router;
