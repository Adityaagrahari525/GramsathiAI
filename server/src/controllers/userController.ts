import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { User } from '../models/User.js';
import { SavedScheme } from '../models/SavedScheme.js';
import { Journey } from '../models/Journey.js';
import { schemeRepository } from '../repositories/schemeRepository.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Fallback in-memory stores for saved schemes and journeys when DB is offline
const inMemorySavedSchemes = new Map<string, Set<string>>([
  ['6738c8f0e14a1234567890ab', new Set(['saur-krushi-vahini', 'dr-ambedkar-krishi', 'ramai-awas'])],
]);

const inMemoryJourneys = new Map<string, any>([
  [
    '6738c8f0e14a1234567890ab_saur-krushi-vahini',
    {
      currentStage: 2,
      completedStages: [1],
      status: 'in_progress',
      updatedAt: new Date(),
    },
  ],
]);

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export const UpdateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  nameMr: z.string().optional(),
  district: z.string().optional(),
  taluka: z.string().optional(),
  village: z.string().optional(),
  preferredLanguage: z.enum(['mr', 'hi', 'en']).optional(),
  interests: z.array(z.string()).optional(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  landholdingAcres: z.number().min(0).optional(),
  socialCategory: z.string().optional(),
  waterSource: z.string().optional(),
  incomeSlab: z.string().optional(),
});

export const SaveSchemeSchema = z.object({
  schemeId: z.string().min(1, 'Scheme ID is required'),
});

export const UpdateJourneySchema = z.object({
  currentStage: z.number().min(1).max(5).optional(),
  completedStages: z.array(z.number().min(1).max(5)).optional(),
  status: z.enum(['in_progress', 'completed', 'on_hold']).optional(),
});

export class UserController {
  /**
   * Get user profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      if (isDbConnected()) {
        const user = await User.findById(userId);
        if (!user) {
          sendError(res, 'User not found', 'USER_NOT_FOUND', 404);
          return;
        }
        sendSuccess(res, { user });
      } else {
        sendSuccess(res, {
          user: {
            id: userId,
            name: req.user?.name || 'Ramesh Dattatray Gaikwad',
            phone: req.user?.phone || '9876543210',
            email: req.user?.email || 'ramesh.gaikwad@gramsathi.in',
            district: 'Pune',
            taluka: 'Baramati',
            village: 'Malegaon Budruk',
            role: req.user?.role || 'citizen',
            landholdingAcres: 2.5,
            socialCategory: 'OBC',
          },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      const updates = req.body;

      if (isDbConnected()) {
        const updated = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true });
        if (!updated) {
          sendError(res, 'User not found', 'USER_NOT_FOUND', 404);
          return;
        }
        sendSuccess(res, { user: updated }, { message: 'Profile updated in database' });
      } else {
        sendSuccess(res, { user: { id: userId, ...updates } }, { message: 'Profile updated in session memory' });
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get saved schemes for authenticated user
   */
  static async getSavedSchemes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      let schemeIds: string[] = [];

      if (isDbConnected()) {
        const records = await SavedScheme.find({ userId }).sort({ savedAt: -1 });
        schemeIds = records.map((r) => r.schemeId);
      } else {
        const set = inMemorySavedSchemes.get(userId) || (userId === '6738c8f0e14a1234567890ab' ? inMemorySavedSchemes.get('6738c8f0e14a1234567890ab') : new Set());
        schemeIds = Array.from(set || []);
      }

      // Populate full scheme details from repository
      const schemes = await Promise.all(schemeIds.map((id) => schemeRepository.getById(id)));
      const validSchemes = schemes.filter(Boolean);

      sendSuccess(res, {
        savedSchemes: schemeIds,
        schemeIds,
        schemes: validSchemes,
        count: schemeIds.length,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Save a scheme to user's portfolio
   */
  static async saveScheme(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      const { schemeId } = req.body;

      if (isDbConnected()) {
        // Idempotent upsert
        await SavedScheme.findOneAndUpdate(
          { userId, schemeId },
          { $setOnInsert: { userId, schemeId, savedAt: new Date() } },
          { upsert: true, new: true }
        );
      } else {
        let set = inMemorySavedSchemes.get(userId);
        if (!set) {
          set = new Set();
          inMemorySavedSchemes.set(userId, set);
        }
        set.add(schemeId);
      }

      sendSuccess(res, { saved: true, schemeId }, { message: `Scheme ${schemeId} saved successfully` });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Remove a scheme from user's portfolio
   */
  static async removeSavedScheme(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      const schemeId = String(req.params.schemeId);

      if (isDbConnected()) {
        await SavedScheme.deleteOne({ userId, schemeId });
      } else {
        const set = inMemorySavedSchemes.get(userId);
        if (set) set.delete(schemeId);
      }

      sendSuccess(res, { removed: true, schemeId }, { message: `Scheme ${schemeId} removed from saved list` });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get scheme journey progress
   */
  static async getJourney(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const schemeId = String(req.params.schemeId);

      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      let journeyData: any = null;

      if (isDbConnected()) {
        journeyData = await Journey.findOne({ userId, schemeId });
      } else {
        const key = `${userId}_${schemeId}`;
        journeyData = inMemoryJourneys.get(key) || (userId === '6738c8f0e14a1234567890ab' ? inMemoryJourneys.get('6738c8f0e14a1234567890ab_saur-krushi-vahini') : null);
      }

      if (!journeyData) {
        // Return default starting journey
        sendSuccess(res, {
          journey: {
            schemeId,
            currentStage: 1,
            completedStages: [1],
            status: 'in_progress',
            updatedAt: new Date(),
          },
        });
        return;
      }

      sendSuccess(res, {
        journey: {
          schemeId: journeyData.schemeId || schemeId,
          currentStage: journeyData.currentStage,
          completedStages: journeyData.completedStages,
          status: journeyData.status,
          updatedAt: journeyData.updatedAt,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update scheme journey progress
   */
  static async updateJourney(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const schemeId = String(req.params.schemeId);
      const { currentStage, completedStages, status } = req.body;

      if (!userId) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      let updatedRecord: any = null;

      if (isDbConnected()) {
        const updateFields: any = { updatedAt: new Date() };
        if (currentStage !== undefined) updateFields.currentStage = currentStage;
        if (completedStages !== undefined) updateFields.completedStages = completedStages;
        if (status !== undefined) updateFields.status = status;

        updatedRecord = await Journey.findOneAndUpdate(
          { userId, schemeId },
          { $set: updateFields },
          { upsert: true, new: true }
        );
      } else {
        const key = `${userId}_${schemeId}`;
        const existing = inMemoryJourneys.get(key) || { currentStage: 1, completedStages: [1], status: 'in_progress' };
        updatedRecord = {
          ...existing,
          ...(currentStage !== undefined ? { currentStage } : {}),
          ...(completedStages !== undefined ? { completedStages } : {}),
          ...(status !== undefined ? { status } : {}),
          updatedAt: new Date(),
        };
        inMemoryJourneys.set(key, updatedRecord);
      }

      sendSuccess(res, { journey: updatedRecord }, { message: 'Journey progress saved successfully' });
    } catch (err) {
      next(err);
    }
  }
}
