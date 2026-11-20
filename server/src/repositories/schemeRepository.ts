import type { Scheme, SchemeFilters } from '../types/scheme.js';
import { SCHEMES_DATABASE, SECTORS_LIST } from '../data/schemes.js';
import { extractQueryTokens, matchIntentFromQuery } from '../utils/searchHelper.js';

export interface CategoryItem {
  id: string;
  title: string;
  titleMr: string;
  schemesCount: number;
  highlights: string;
  color: string;
}

export interface DepartmentItem {
  name: string;
  departmentShort: string;
  count: number;
}

export interface ISchemeRepository {
  getAll(filters?: SchemeFilters): Promise<{ schemes: Scheme[]; total: number }>;
  getById(id: string): Promise<Scheme | null>;
  search(query: string, limit?: number): Promise<Scheme[]>;
  getCategories(): Promise<CategoryItem[]>;
  getDepartments(): Promise<DepartmentItem[]>;
}

export class StaticSchemeRepository implements ISchemeRepository {
  private schemes: Scheme[];

  constructor() {
    this.schemes = [...SCHEMES_DATABASE];
  }

  async getAll(filters?: SchemeFilters): Promise<{ schemes: Scheme[]; total: number }> {
    let result = [...this.schemes];

    if (filters?.sector && filters.sector !== 'all') {
      result = result.filter(
        (s) => s.sector.toLowerCase() === filters.sector?.toLowerCase()
      );
    }

    if (filters?.level) {
      result = result.filter((s) => s.level === filters.level);
    }

    if (filters?.benefitType) {
      result = result.filter((s) => s.benefitType === filters.benefitType);
    }

    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const rawQuery = filters.searchQuery.trim();
      const q = rawQuery.toLowerCase().trim();
      const intent = matchIntentFromQuery(rawQuery);
      const tokens = extractQueryTokens(rawQuery).filter((t) => t.length >= 3);

      result = result.filter((s) => {
        const directHit =
          s.name.toLowerCase().includes(q) ||
          s.nameMr.includes(q) ||
          s.nameHi.includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.targetBeneficiaryText.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q));

        if (directHit) return true;

        if (intent.isMatchFound) {
          if (intent.matchedSectors.includes(s.sector)) return true;
          if (s.tags.some((t) => intent.matchedTags.includes(t.toLowerCase()))) return true;
          if (
            s.targetBeneficiaries.some((b) =>
              intent.matchedCategories.some((c) => b.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(b.toLowerCase()))
            )
          ) {
            return true;
          }
        }

        if (tokens.length > 0) {
          const hasToken = tokens.some(
            (token) =>
              s.name.toLowerCase().includes(token) ||
              s.nameMr.includes(token) ||
              s.summary.toLowerCase().includes(token) ||
              s.targetBeneficiaryText.toLowerCase().includes(token) ||
              s.tags.some((t) => t.toLowerCase().includes(token))
          );
          if (hasToken) return true;
        }

        return false;
      });
    }

    const total = result.length;

    if (filters?.offset !== undefined) {
      result = result.slice(filters.offset);
    }

    if (filters?.limit !== undefined && filters.limit > 0) {
      result = result.slice(0, filters.limit);
    }

    return { schemes: result, total };
  }

  async getById(id: string): Promise<Scheme | null> {
    const cleanId = id.trim().toLowerCase();
    const found = this.schemes.find(
      (s) => s.id.toLowerCase() === cleanId || s.schemeNo?.toLowerCase() === cleanId
    );
    return found || null;
  }

  async search(query: string, limit = 10): Promise<Scheme[]> {
    if (!query || !query.trim()) {
      return this.schemes.slice(0, limit);
    }

    const rawQuery = query.trim();
    const q = rawQuery.toLowerCase();
    const intent = matchIntentFromQuery(rawQuery);
    const tokens = extractQueryTokens(rawQuery).filter((t) => t.length >= 3);

    const matched = this.schemes.filter((s) => {
      const directHit =
        s.name.toLowerCase().includes(q) ||
        s.nameMr.includes(q) ||
        s.nameHi.includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.targetBeneficiaryText.toLowerCase().includes(q) ||
        s.tags.some((tag) => tag.toLowerCase().includes(q));

      if (directHit) return true;

      if (intent.isMatchFound) {
        if (intent.matchedSectors.includes(s.sector)) return true;
        if (s.tags.some((t) => intent.matchedTags.includes(t.toLowerCase()))) return true;
        if (
          s.targetBeneficiaries.some((b) =>
            intent.matchedCategories.some((c) => b.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(b.toLowerCase()))
          )
        ) {
          return true;
        }
      }

      if (tokens.length > 0) {
        const hasToken = tokens.some(
          (token) =>
            s.name.toLowerCase().includes(token) ||
            s.nameMr.includes(token) ||
            s.summary.toLowerCase().includes(token) ||
            s.targetBeneficiaryText.toLowerCase().includes(token) ||
            s.tags.some((t) => t.toLowerCase().includes(token))
        );
        if (hasToken) return true;
      }

      return false;
    });

    return matched.slice(0, limit);
  }

  async getCategories(): Promise<CategoryItem[]> {
    return SECTORS_LIST;
  }

  async getDepartments(): Promise<DepartmentItem[]> {
    const deptMap = new Map<string, { count: number; shortName: string }>();

    for (const scheme of this.schemes) {
      const current = deptMap.get(scheme.department) || {
        count: 0,
        shortName: scheme.departmentShort || scheme.department,
      };
      current.count += 1;
      deptMap.set(scheme.department, current);
    }

    const departments: DepartmentItem[] = [];
    deptMap.forEach((meta, name) => {
      departments.push({
        name,
        departmentShort: meta.shortName,
        count: meta.count,
      });
    });

    return departments.sort((a, b) => b.count - a.count);
  }
}

import { MongoSchemeRepository } from './mongoSchemeRepository.js';

// Singleton repository instance: Mongo-backed with automatic offline static fallback
export const schemeRepository: ISchemeRepository = new MongoSchemeRepository();

