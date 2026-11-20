import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { GeminiAssistantService } from '../services/geminiAssistantService.js';
import { sendSuccess } from '../utils/response.js';

export const AssistantChatSchema = z.object({
  message: z.string().min(1, 'Query message cannot be empty'),
  language: z.enum(['en', 'mr', 'hi']).optional().default('mr'),
  conversationHistory: z
    .array(
      z.object({
        sender: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});

export class AssistantController {
  static async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const options = req.body;
      const result = await GeminiAssistantService.answer(options);

      sendSuccess(res, result, {
        source: result.source,
        isConfigured: result.isConfigured,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStatus(_req: Request, res: Response): Promise<void> {
    const isConfigured = GeminiAssistantService.isApiKeyConfigured();
    sendSuccess(res, {
      service: 'Gemini AI Assistant',
      isConfigured,
      mode: isConfigured ? 'gemini_grounded' : 'deterministic_fallback',
      statusNotice: isConfigured
        ? 'Gemini 2.5 Flash active with strict grounding on 25 verified Maharashtra scheme records.'
        : 'Gemini API key is not configured in server/.env. Platform is running in reliable deterministic rule-based civic mode.',
      supportedLanguages: ['mr', 'en', 'hi'],
    });
  }
}
