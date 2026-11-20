import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { DiscoveryService } from '../services/discoveryService.js';
import { sendSuccess } from '../utils/response.js';

export const RecommendSchema = z.object({
  query: z.string().min(1, 'Need query cannot be empty'),
  options: z
    .object({
      eligibleOnly: z.boolean().optional(),
      userHolding: z.number().min(0).optional(),
      category: z.string().optional(),
    })
    .optional(),
});

export class DiscoveryController {
  static async recommendSchemes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body;
      const response = await DiscoveryService.recommend(input);

      sendSuccess(res, response.results, {
        query: response.query,
        totalMatches: response.totalMatches,
      });
    } catch (err) {
      next(err);
    }
  }
}
