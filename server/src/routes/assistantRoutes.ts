import { Router } from 'express';
import { AssistantController, AssistantChatSchema } from '../controllers/assistantController.js';
import { validateBody } from '../middleware/validateRequest.js';

const router = Router();

router.get('/status', AssistantController.getStatus);
router.post('/chat', validateBody(AssistantChatSchema), AssistantController.chat);

export default router;
