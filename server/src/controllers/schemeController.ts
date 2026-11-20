import type { Request, Response, NextFunction } from 'express';
import { SchemeService } from '../services/schemeService.js';
import { sendSuccess, sendError } from '../utils/response.js';
import type { SchemeFilters } from '../types/scheme.js';

export class SchemeController {
  static async getSchemes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { sector, level, benefitType, search, limit, page } = req.query;

      const filters: SchemeFilters = {};
      if (typeof sector === 'string') filters.sector = sector;
      if (level === 'Maharashtra' || level === 'Central' || level === 'Joint') filters.level = level;
      if (
        benefitType === 'cash' ||
        benefitType === 'subsidy' ||
        benefitType === 'loan' ||
        benefitType === 'scholarship' ||
        benefitType === 'employment'
      ) {
        filters.benefitType = benefitType;
      }
      if (typeof search === 'string') filters.searchQuery = search;

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 20;
      filters.offset = (pageNum - 1) * limitNum;
      filters.limit = limitNum;

      const { schemes, total } = await SchemeService.getSchemes(filters);

      sendSuccess(res, schemes, {
        total,
        count: schemes.length,
        page: pageNum,
        limit: limitNum,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getSchemeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const scheme = await SchemeService.getSchemeById(id);

      if (!scheme) {
        sendError(res, `Scheme with ID '${id}' was not found`, 'SCHEME_NOT_FOUND', 404);
        return;
      }

      sendSuccess(res, scheme);
    } catch (err) {
      next(err);
    }
  }

  static async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await SchemeService.getCategories();
      sendSuccess(res, categories, { count: categories.length });
    } catch (err) {
      next(err);
    }
  }

  static async getDepartments(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const departments = await SchemeService.getDepartments();
      sendSuccess(res, departments, { count: departments.length });
    } catch (err) {
      next(err);
    }
  }

  static async searchSchemes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const results = await SchemeService.searchSchemes(q, limit);
      sendSuccess(res, results, {
        query: q,
        count: results.length,
      });
    } catch (err) {
      next(err);
    }
  }
}
