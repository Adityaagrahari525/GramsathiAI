import { Router } from 'express';
import {
  UserController,
  UpdateProfileSchema,
  SaveSchemeSchema,
  UpdateJourneySchema,
} from '../controllers/userController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { authenticateJwt } from '../middleware/authenticateJwt.js';

const router = Router();

// Profile operations (protected)
router.get('/profile', authenticateJwt, UserController.getProfile);
router.put('/profile', authenticateJwt, validateBody(UpdateProfileSchema), UserController.updateProfile);

// Saved Schemes portfolio operations (protected)
router.get('/saved-schemes', authenticateJwt, UserController.getSavedSchemes);
router.post('/saved-schemes', authenticateJwt, validateBody(SaveSchemeSchema), UserController.saveScheme);
router.delete('/saved-schemes/:schemeId', authenticateJwt, UserController.removeSavedScheme);

// Scheme Journey Tracker operations (protected)
router.get('/journey/:schemeId', authenticateJwt, UserController.getJourney);
router.put(
  '/journey/:schemeId',
  authenticateJwt,
  validateBody(UpdateJourneySchema),
  UserController.updateJourney
);

export default router;
