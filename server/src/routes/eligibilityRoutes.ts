import { Router } from 'express';
import { EligibilityController, EligibilityCheckSchema } from '../controllers/eligibilityController.js';
import { validateBody } from '../middleware/validateRequest.js';

const router = Router();

router.post('/check', validateBody(EligibilityCheckSchema), EligibilityController.checkEligibility);

export default router;
