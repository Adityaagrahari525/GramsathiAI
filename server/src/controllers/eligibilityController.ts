import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { EligibilityService } from '../services/eligibilityService.js';
import { sendSuccess } from '../utils/response.js';

export const EligibilityCheckSchema = z.object({
  age: z.number().min(0).max(120).optional(),
  gender: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  taluka: z.string().optional(),
  village: z.string().optional(),
  pinCode: z.string().optional(),
  occupation: z.string().optional(),
  socialCategory: z.string().optional(),
  landholding: z.string().optional(),
  landholdingAcres: z.number().min(0).optional(),
  incomeSlab: z.string().optional(),
  waterSource: z.string().optional(),
  hasElectricPump: z.boolean().optional(),
  hasAadhaarLinkedBank: z.boolean().optional(),
});

export class EligibilityController {
  static async checkEligibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = req.body;
      const report = await EligibilityService.evaluateProfile(profile);

      sendSuccess(res, report, {
        evaluatedCount: report.totalEvaluated,
        eligibleCount: report.eligibleCount,
        actionRequiredCount: report.actionRequiredCount,
      });
    } catch (err) {
      next(err);
    }
  }
}
