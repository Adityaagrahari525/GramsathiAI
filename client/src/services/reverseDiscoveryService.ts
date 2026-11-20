import { SchemeService } from './schemeService';
import { apiClient } from './apiClient';
import type { Scheme } from '../data/schemesData';

export interface MatchedNeedResult {
  scheme: Scheme;
  matchScore: number; // percentage, e.g. 95
  matchedReason: string;
  relevantEligibility: string;
  detailUrl: string;
  matchedKeywords: string[];
}

export interface NeedPreset {
  id: string;
  query: string;
  queryMr: string;
  icon: string;
  targetCategory: string;
}

export const PRESET_NEEDS: NeedPreset[] = [
  {
    id: 'farming',
    query: 'I want financial support for farming',
    queryMr: 'मला शेतीसाठी आर्थिक व सिंचन मदत हवी आहे',
    icon: '🚜',
    targetCategory: 'agriculture'
  },
  {
    id: 'business',
    query: 'I want to start a small business',
    queryMr: 'मला नवीन छोटा व्यवसाय / उद्योग सुरू करायचा आहे',
    icon: '💼',
    targetCategory: 'msme'
  },
  {
    id: 'education',
    query: 'I need educational assistance',
    queryMr: 'मला उच्च शिक्षणासाठी शिष्यवृत्ती व फी सवलत हवी आहे',
    icon: '🎓',
    targetCategory: 'education'
  },
  {
    id: 'shg',
    query: 'I am a member of a self-help group',
    queryMr: 'मी महिला बचत गट (SHG) ची सदस्य आहे',
    icon: '👩',
    targetCategory: 'women'
  },
  {
    id: 'entrepreneurship',
    query: 'I need support for rural entrepreneurship',
    queryMr: 'मला ग्रामीण भागात उद्योग निर्मितीसाठी अनुदान हवे आहे',
    icon: '🏭',
    targetCategory: 'msme'
  }
];

interface RulePattern {
  category: string;
  keywords: string[];
  schemes: string[];
  reasonTemplate: (scheme: Scheme) => string;
  eligibilityKey: (scheme: Scheme) => string;
}

const RULE_PATTERNS: RulePattern[] = [
  {
    category: 'farming',
    keywords: [
      'farming', 'farm', 'farmer', 'agriculture', 'shetkari', 'krushi', 'pump', 'solar',
      'irrigation', 'water', 'well', 'borewell', 'tractor', 'machinery', 'pik vima',
      'crop', 'insurance', 'drought', '7/12', 'satbara', 'drip', 'sprinkler'
    ],
    schemes: ['saur-krushi-vahini', 'pm-kisan', 'tractor-subsidy', 'pik-vima'],
    reasonTemplate: (s) =>
      `Provides direct support for agricultural cultivation and farm operations (${s.highlightTitle} ${s.benefitAmount}).`,
    eligibilityKey: (s) =>
      s.eligibility[0] || 'Must hold cultivable land in Maharashtra.'
  },
  {
    category: 'business',
    keywords: [
      'business', 'small business', 'startup', 'shop', 'loan', 'credit', 'enterprise',
      'manufacturing', 'service', 'mudra', 'cmegp', 'msme', 'pmegp', 'capital', 'investment'
    ],
    schemes: ['cmegp-msme'],
    reasonTemplate: (s) =>
      `Offers credit-linked margin subsidy up to ₹50 Lakh (${s.benefitAmount}) for setting up new enterprises.`,
    eligibilityKey: (_s) =>
      'Resident of Maharashtra aged 18–45 with minimum 7th/10th standard qualification.'
  },
  {
    category: 'education',
    keywords: [
      'education', 'educational', 'scholarship', 'shikshan', 'shishyavrutti', 'college',
      'school', 'fee', 'tuition', 'degree', 'diploma', 'engineering', 'student', 'ebc', 'hostel'
    ],
    schemes: ['ebc-scholarship'],
    reasonTemplate: (s) =>
      `Reimburses tuition and examination fees (${s.benefitAmount}) for professional & general college admissions.`,
    eligibilityKey: (_s) =>
      'Admitted via CAP in Maharashtra with annual family income up to ₹8.00 Lakh.'
  },
  {
    category: 'shg',
    keywords: [
      'self-help', 'self help', 'shg', 'bachat gat', 'women', 'mahila', 'ladki bahin',
      'mother', 'sister', 'female', 'lakhpati didi', 'maternity'
    ],
    schemes: ['ladki-bahin', 'tractor-subsidy'],
    reasonTemplate: (s) =>
      s.id === 'ladki-bahin'
        ? 'Empowers women beneficiaries with ₹1,500 monthly DBT financial support directly into bank accounts.'
        : 'Priority quota and subsidized equipment rates for women & self-help group members.',
    eligibilityKey: (s) =>
      s.id === 'ladki-bahin'
        ? 'Resident woman aged 21–65 with household annual income below ₹2.5 Lakh.'
        : 'Cultivable land ownership with priority quota for female applicants.'
  },
  {
    category: 'entrepreneurship',
    keywords: [
      'rural entrepreneurship', 'entrepreneurship', 'entrepreneur', 'artisan', 'craft',
      'rural industry', 'village enterprise', 'unemployed', 'self-employed', 'rogar'
    ],
    schemes: ['cmegp-msme'],
    reasonTemplate: (s) =>
      `Provides dedicated rural employment generation assistance (${s.benefitAmount}) with special subsidies for rural youth.`,
    eligibilityKey: (_s) =>
      'Unemployed rural or urban youth starting new manufacturing or service units in Maharashtra.'
  },
  {
    category: 'employment',
    keywords: [
      'employment', 'job', 'apprentice', 'training', 'skill', 'mgnrega', 'wage', 'stipend',
      'work', 'placement', 'internship', 'unemployed youth'
    ],
    schemes: ['cmegp-msme'],
    reasonTemplate: (_s) =>
      `Assists rural youth and entrepreneurs with project subsidies and self-employment funding up to ₹50 Lakh.`,
    eligibilityKey: (_s) =>
      'Unemployed Maharashtra domicile aged 18–45.'
  },
  {
    category: 'pensions',
    keywords: [
      'pension', 'destitute', 'disabled', 'divyang', 'widow', 'elderly', 'senior citizen',
      'social security', 'niradhar', 'blind', 'handicapped'
    ],
    schemes: ['sanjay-gandhi-niradhar'],
    reasonTemplate: (s) =>
      `Monthly direct cash pension of ₹1,500 (${s.benefitAmount}) providing essential social security.`,
    eligibilityKey: (_s) =>
      'Family income below ₹21,000/yr with 15-year Maharashtra domicile proof.'
  }
];

export const ReverseDiscoveryService = {
  /**
   * Returns list of pre-configured common civic need questions
   */
  getPresets(): NeedPreset[] {
    return PRESET_NEEDS;
  },

  /**
   * Async: Modular rule-based matching via Node.js/Express REST API (POST /api/discovery/recommend)
   * Falls back to local matching if backend is offline.
   */
  async matchNeedsAsync(
    query: string,
    options?: { eligibleOnly?: boolean; userHolding?: number; category?: string }
  ): Promise<MatchedNeedResult[]> {
    try {
      const apiRes = await apiClient.recommendSchemes(query, options);
      if (apiRes.success && Array.isArray(apiRes.data)) {
        return apiRes.data;
      }
    } catch (e) {
      console.warn('[ReverseDiscoveryService] Backend API recommend failed, using fallback:', e);
    }
    return this.matchNeeds(query, options);
  },

  /**
   * Modular rule-based keyword & category matching for user need queries
   */
  matchNeeds(query: string, options?: { eligibleOnly?: boolean; userHolding?: number }): MatchedNeedResult[] {
    if (!query || !query.trim()) {
      // Default to top recommended agriculture & livelihood schemes
      return this.matchNeeds('farming');
    }

    const clean = query.toLowerCase().trim();
    const allSchemes = SchemeService.getAll();
    const schemeMap = new Map<string, Scheme>();
    allSchemes.forEach((s) => schemeMap.set(s.id, s));

    const matchedScores = new Map<string, { score: number; reason: string; eligibility: string; matchedWords: string[] }>();

    for (const rule of RULE_PATTERNS) {
      const hitKeywords = rule.keywords.filter((kw) => clean.includes(kw));
      if (hitKeywords.length > 0) {
        const baseScore = Math.min(95, 70 + hitKeywords.length * 8);

        for (const schemeId of rule.schemes) {
          const scheme = schemeMap.get(schemeId);
          if (!scheme) continue;

          // Landholding filter condition if specified
          if (options?.eligibleOnly && options.userHolding !== undefined) {
            if (scheme.sector === 'agriculture' && options.userHolding <= 0) {
              continue;
            }
          }

          const existing = matchedScores.get(schemeId);
          if (!existing || baseScore > existing.score) {
            matchedScores.set(schemeId, {
              score: baseScore,
              reason: rule.reasonTemplate(scheme),
              eligibility: rule.eligibilityKey(scheme),
              matchedWords: hitKeywords
            });
          }
        }
      }
    }

    // Direct keyword search fallback if rule patterns didn't capture exact words
    if (matchedScores.size === 0) {
      const searchResults = SchemeService.filterSchemes({ searchQuery: clean });
      for (const scheme of searchResults.slice(0, 3)) {
        matchedScores.set(scheme.id, {
          score: 80,
          reason: `Matches your search keywords "${clean}" in ${scheme.name}.`,
          eligibility: scheme.eligibility[0] || 'Must satisfy state demographic criteria.',
          matchedWords: [clean]
        });
      }
    }

    // Fallback: if still nothing, return top 3 flagship schemes
    if (matchedScores.size === 0) {
      const defaults = ['saur-krushi-vahini', 'cmegp-msme', 'ladki-bahin'];
      for (const id of defaults) {
        const s = schemeMap.get(id);
        if (s) {
          matchedScores.set(s.id, {
            score: 75,
            reason: `Flagship Maharashtra public welfare program (${s.benefitAmount}).`,
            eligibility: s.eligibility[0] || 'State domicile and income verification.',
            matchedWords: ['general assistance']
          });
        }
      }
    }

    const results: MatchedNeedResult[] = [];
    matchedScores.forEach((meta, id) => {
      const scheme = schemeMap.get(id);
      if (scheme) {
        results.push({
          scheme,
          matchScore: meta.score,
          matchedReason: meta.reason,
          relevantEligibility: meta.eligibility,
          detailUrl: `/scheme/${scheme.id}`,
          matchedKeywords: meta.matchedWords
        });
      }
    });

    // Sort descending by match score
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }
};
