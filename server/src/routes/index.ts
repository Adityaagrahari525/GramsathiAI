import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import schemeRoutes from './schemeRoutes.js';
import eligibilityRoutes from './eligibilityRoutes.js';
import discoveryRoutes from './discoveryRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import assistantRoutes from './assistantRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/schemes', schemeRoutes);
router.use('/eligibility', eligibilityRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/assistant', assistantRoutes);

export default router;
