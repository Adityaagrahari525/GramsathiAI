import { Router } from 'express';
import { AuthController, RegisterSchema, LoginSchema } from '../controllers/authController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { authenticateJwt } from '../middleware/authenticateJwt.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, validateBody(RegisterSchema), AuthController.register);
router.post('/login', authRateLimiter, validateBody(LoginSchema), AuthController.login);
router.get('/me', authenticateJwt, AuthController.getMe);
router.post('/logout', AuthController.logout);

export default router;
