import { SCHEMES_DATABASE, SECTORS_LIST } from '../data/schemesData';
import type { Scheme } from '../data/schemesData';
import { apiClient } from './apiClient';
import { extractQueryTokens, matchIntentFromQuery } from '../utils/searchHelper';
export type { Scheme };

export interface SchemeFilterOptions {
  searchQuery?: string;
  sectorTab?: string;
  levelGov?: string[];
  beneficiaryCat?: string[];
  benefitType?: string[];
  socialCat?: string[];
  district?: string;
  sortBy?: 'relevant' | 'newest' | 'benefit_high';
}

/**
 * SchemeService — Centralized service for GramSathi AI
 * Communicates with the Node.js/Express REST API with seamless fallback.
 */
export const SchemeService = {
  /**
   * Async: Fetch schemes from REST API with fallback to local dataset
   */
  async fetchAllAsync(): Promise<Scheme[]> {
    const res = await apiClient.getSchemes();
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return this.getAll();
  },

  /**
   * Async: Fetch single scheme by ID from REST API with fallback
   */
  async fetchByIdAsync(id: string): Promise<Scheme | undefined> {
    const res = await apiClient.getSchemeById(id);
    if (res.success && res.data) {
      return res.data;
    }
    return this.getById(id);
  },

  /**
   * Async: Search schemes via REST API
   */
  async searchAsync(query: string, limit = 10): Promise<Scheme[]> {
    const res = await apiClient.searchSchemes(query, limit);
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return this.filterSchemes({ searchQuery: query }).slice(0, limit);
  },

  /**
   * Retrieves all demonstration schemes
   */
  getAll(): Scheme[] {
    return [...SCHEMES_DATABASE];
  },

  /**
   * Finds a scheme by its unique identifier or alias
   */
  getById(id: string): Scheme | undefined {
    if (!id) return undefined;
    const clean = id.toLowerCase().trim();
    return SCHEMES_DATABASE.find(
      (s) =>
        s.id.toLowerCase() === clean ||
        s.id.toLowerCase().replace(/[^a-z0-9]/g, '') === clean.replace(/[^a-z0-9]/g, '') ||
        s.schemeNo?.toLowerCase() === clean
    );
  },

  /**
   * Finds related schemes in the same sector
   */
  getRelated(schemeId: string, limit = 3): Scheme[] {
    const current = this.getById(schemeId);
    if (!current) return SCHEMES_DATABASE.slice(0, limit);
    return SCHEMES_DATABASE.filter(
      (s) => s.id !== current.id && (s.sector === current.sector || s.level === current.level)
    ).slice(0, limit);
  },

  /**
   * Retrieves all available sectors
   */
  getSectors() {
    return SECTORS_LIST;
  },

  /**
   * Performs multi-facet searching and filtering across schemes
   */
  filterSchemes(filters: SchemeFilterOptions): Scheme[] {
    let result = [...SCHEMES_DATABASE];

    // 1. Sector Tab filter
    if (filters.sectorTab && filters.sectorTab !== 'all') {
      result = result.filter(
        (s) => s.sector.toLowerCase() === filters.sectorTab?.toLowerCase()
      );
    }

    // 2. Search Query filter with Intent & Synonym Recognition
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const rawQuery = filters.searchQuery.trim();
      const q = rawQuery.toLowerCase();
      const intent = matchIntentFromQuery(rawQuery);
      const tokens = extractQueryTokens(rawQuery).filter((t) => t.length >= 3);

      result = result.filter((s) => {
        // Direct substring matches
        const directHit =
          s.name.toLowerCase().includes(q) ||
          s.nameMr.toLowerCase().includes(q) ||
          s.nameHi.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.summary.toLowerCase().includes(q) ||
          s.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          s.targetBeneficiaries.some((b) => b.toLowerCase().includes(q)) ||
          s.highlightText.toLowerCase().includes(q);

        if (directHit) return true;

        // Intent matching
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

        // Token matching
        if (tokens.length > 0) {
          const hasToken = tokens.some(
            (token) =>
              s.name.toLowerCase().includes(token) ||
              s.nameMr.includes(token) ||
              s.summary.toLowerCase().includes(token) ||
              s.tags.some((t) => t.toLowerCase().includes(token)) ||
              s.targetBeneficiaries.some((b) => b.toLowerCase().includes(token))
          );
          if (hasToken) return true;
        }

        return false;
      });
    }

    // 3. Government Level filter
    if (filters.levelGov && filters.levelGov.length > 0) {
      result = result.filter((s) => {
        return filters.levelGov!.some((lvl) => {
          if (lvl.includes('Maharashtra') && (s.level === 'Maharashtra' || s.level === 'Joint')) return true;
          if (lvl.includes('Central') && (s.level === 'Central' || s.level === 'Joint')) return true;
          if (lvl.includes('Joint') && s.level === 'Joint') return true;
          return false;
        });
      });
    }

    // 4. Beneficiary Category filter
    if (filters.beneficiaryCat && filters.beneficiaryCat.length > 0) {
      result = result.filter((s) => {
        return filters.beneficiaryCat!.some((cat) => {
          const lowerCat = cat.toLowerCase();
          if (lowerCat.includes('farmer') && s.sector === 'agriculture') return true;
          if (lowerCat.includes('women') && (s.sector === 'women' || s.tags.includes('Women Empowerment'))) return true;
          if (lowerCat.includes('youth') && (s.sector === 'education' || s.sector === 'msme')) return true;
          if (lowerCat.includes('artisan') && s.sector === 'msme') return true;
          return s.targetBeneficiaries.some((tb) => tb.toLowerCase().includes(lowerCat));
        });
      });
    }

    // 5. Benefit Type filter
    if (filters.benefitType && filters.benefitType.length > 0) {
      result = result.filter((s) => {
        return filters.benefitType!.some((bt) => {
          const lower = bt.toLowerCase();
          if (lower.includes('subsidy') && s.benefitType === 'subsidy') return true;
          if (lower.includes('cash') && s.benefitType === 'cash') return true;
          if (lower.includes('loan') && s.benefitType === 'loan') return true;
          if (lower.includes('scholarship') && s.benefitType === 'scholarship') return true;
          return false;
        });
      });
    }

    // 6. Sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.sortBy === 'benefit_high') {
      result.sort((a, b) => {
        const getScore = (s: Scheme) => {
          if (s.benefitAmount.includes('Lakh')) return 500000;
          if (s.benefitAmount.includes('95%')) return 250000;
          if (s.benefitAmount.includes('90%')) return 200000;
          if (s.benefitAmount.includes('18,000')) return 18000;
          if (s.benefitAmount.includes('6,000')) return 6000;
          return 1000;
        };
        return getScore(b) - getScore(a);
      });
    }

    return result;
  }
};
