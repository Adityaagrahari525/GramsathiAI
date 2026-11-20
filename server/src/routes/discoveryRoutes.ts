import { Router } from 'express';
import { DiscoveryController, RecommendSchema } from '../controllers/discoveryController.js';
import { validateBody } from '../middleware/validateRequest.js';

const router = Router();

router.post('/recommend', validateBody(RecommendSchema), DiscoveryController.recommendSchemes);

export default router;
