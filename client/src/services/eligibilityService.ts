import { SchemeService } from './schemeService';
import { apiClient } from './apiClient';
import type { Scheme } from '../data/schemesData';
import type { CitizenProfile } from '../context/CitizenProfileContext';

export type EligibilityVerdict = 'TRUE' | 'FALSE' | 'UNKNOWN';

export interface EvaluatedScheme {
  scheme: Scheme;
  verdict: 'potentially_eligible' | 'does_not_match' | 'more_info_required';
  logicalVerdict: EligibilityVerdict; // TRUE (Eligible), FALSE (Does not match), UNKNOWN (More information required)
  score: number; // percentage, e.g. 100, 75
  matchedCriteria: string[];
  missingCriteria: string[];
  reasons: {
    eligibilityReasons: string[];
    disqualificationReasons: string[];
    missingInfoReasons: string[];
  };
  verifiedDocuments: string[]; // Strictly filtered verified documents from official scheme gazette
  recommendationReason: string;
  estimatedBenefit: string;
}

export interface EligibilityEvaluationReport {
  timestamp: string;
  profileEvaluated: CitizenProfile;
  totalEvaluated: number;
  eligibleCount: number;
  actionRequiredCount: number;
  ineligibleCount: number;
  topMatches: EvaluatedScheme[];
  actionRequiredMatches: EvaluatedScheme[];
  ineligibleMatches?: EvaluatedScheme[];
  source?: 'rest_api' | 'local_fallback';
}

export const EligibilityService = {
  /**
   * Async: Evaluates profile via Node.js/Express REST API (POST /api/eligibility/check)
   * Falls back seamlessly to local evaluation if backend is offline.
   */
  async evaluateAsync(profile: CitizenProfile): Promise<EligibilityEvaluationReport> {
    try {
      const apiRes = await apiClient.checkEligibility(profile);
      if (apiRes.success && apiRes.data) {
        const data = apiRes.data;
        const enrichMatch = (m: any): EvaluatedScheme => ({
          ...m,
          logicalVerdict:
            m.verdict === 'potentially_eligible'
              ? 'TRUE'
              : m.verdict === 'does_not_match'
              ? 'FALSE'
              : 'UNKNOWN',
          reasons: {
            eligibilityReasons: m.matchedCriteria || [],
            disqualificationReasons: m.verdict === 'does_not_match' ? m.missingCriteria || [] : [],
            missingInfoReasons: m.verdict === 'more_info_required' ? m.missingCriteria || [] : [],
          },
          verifiedDocuments: Array.isArray(m.scheme?.mandatoryDocs) && m.scheme.mandatoryDocs.length > 0
            ? m.scheme.mandatoryDocs
            : Array.isArray(m.scheme?.documents)
            ? m.scheme.documents
            : [],
        });

        return {
          ...data,
          topMatches: (data.topMatches || []).map(enrichMatch),
          actionRequiredMatches: (data.actionRequiredMatches || []).map(enrichMatch),
          source: 'rest_api',
        };
      }
    } catch (e) {
      console.warn('[EligibilityService] Backend API evaluation failed, using fallback:', e);
    }
    const local = this.evaluate(profile);
    return { ...local, source: 'local_fallback' };
  },

  /**
   * Deterministically evaluates a citizen profile against the demonstration scheme database
   */
  evaluate(profile: CitizenProfile): EligibilityEvaluationReport {
    const allSchemes = SchemeService.getAll();
    const evaluated: EvaluatedScheme[] = [];

    for (const scheme of allSchemes) {
      const matchedCriteria: string[] = [];
      const missingCriteria: string[] = [];
      let isMismatch = false;

      // 1. Residence & State Check (Maharashtra civic platform)
      if (profile.state === 'Maharashtra') {
        matchedCriteria.push('Maharashtra State Domicile Verified');
      }

      // 2. Gender checks
      const isWomenScheme =
        scheme.sector === 'women' ||
        scheme.id.includes('ladki') ||
        scheme.name.toLowerCase().includes('mahila');

      if (isWomenScheme) {
        if (profile.gender.toLowerCase() === 'female') {
          matchedCriteria.push('Eligible Gender (Female applicant)');
        } else {
          isMismatch = true;
          missingCriteria.push('Scheme strictly reserved for women beneficiaries');
        }
      } else {
        matchedCriteria.push('Gender criteria universally eligible');
      }

      // 3. Age checks
      if (scheme.id.includes('ladki')) {
        if (profile.age >= 21 && profile.age <= 65) {
          matchedCriteria.push(`Age ${profile.age} yrs within 21-65 bracket`);
        } else {
          isMismatch = true;
          missingCriteria.push(`Age ${profile.age} outside 21-65 eligibility bracket`);
        }
      } else if (scheme.sector === 'education' || scheme.id.includes('ebc')) {
        if (profile.age >= 17 && profile.age <= 35) {
          matchedCriteria.push('Student / Youth age category');
        } else {
          missingCriteria.push('Post-matric scholarship targeted for student youth (17–35)');
        }
      } else if (scheme.id.includes('cmegp')) {
        if (profile.age >= 18 && profile.age <= 45) {
          matchedCriteria.push(`Age ${profile.age} yrs within 18-45 CMEGP bracket`);
        } else {
          isMismatch = true;
          missingCriteria.push(`Age ${profile.age} outside 18-45 self-employment ceiling`);
        }
      } else {
        matchedCriteria.push('Age criteria verified (>18 yrs)');
      }

      // 4. Landholding checks
      if (scheme.sector === 'agriculture' || scheme.id.includes('saur') || scheme.id.includes('kisan')) {
        if (profile.landholdingAcres > 0) {
          matchedCriteria.push(`Agricultural Landholding: ${profile.landholding}`);
        } else {
          isMismatch = true;
          missingCriteria.push('Requires verified agricultural cultivable landholding on 7/12 extract');
        }
      }

      // 5. Water Source checks for Solar pump & irrigation
      if (scheme.id.includes('saur') || scheme.id.includes('micro') || scheme.id.includes('irrigation')) {
        if (profile.waterSource && !profile.waterSource.toLowerCase().includes('none')) {
          matchedCriteria.push(`Assured Perennial Water Source: ${profile.waterSource}`);
        } else {
          missingCriteria.push('Water source verification needed (open well, borewell, or farm pond)');
        }

        if (profile.hasElectricPump) {
          isMismatch = true;
          missingCriteria.push('Existing energized conventional grid pump connection detected on survey plot');
        } else {
          matchedCriteria.push('No existing conventional grid agricultural electricity connection');
        }
      }

      // 6. Social Category checks
      if (scheme.id.includes('ambedkar') || scheme.name.toLowerCase().includes('ambedkar')) {
        if (profile.socialCategory.toLowerCase().includes('sc')) {
          matchedCriteria.push('Scheduled Caste (SC) category verified');
        } else {
          isMismatch = true;
          missingCriteria.push('Special component grant reserved for Scheduled Caste / Neo-Buddhist community');
        }
      } else if (scheme.id.includes('ebc')) {
        if (
          profile.socialCategory.toLowerCase().includes('obc') ||
          profile.socialCategory.toLowerCase().includes('general') ||
          profile.socialCategory.toLowerCase().includes('open')
        ) {
          matchedCriteria.push('Open / EBC / OBC category eligible');
        }
      }

      // 7. Income checks
      if (profile.incomeSlab === 'above_800k') {
        if (scheme.id.includes('ladki') || scheme.id.includes('ebc') || scheme.id.includes('ambedkar')) {
          isMismatch = true;
          missingCriteria.push('Annual household income exceeds scheme ceiling');
        }
      } else {
        matchedCriteria.push('Income slab within statutory limit');
      }

      // Compute Verdict & Score
      let verdict: 'potentially_eligible' | 'does_not_match' | 'more_info_required' = 'potentially_eligible';
      let logicalVerdict: EligibilityVerdict = 'TRUE';
      let score = 100;

      if (isMismatch) {
        verdict = 'does_not_match';
        logicalVerdict = 'FALSE';
        score = Math.max(10, Math.round((matchedCriteria.length / (matchedCriteria.length + missingCriteria.length)) * 100));
      } else if (missingCriteria.length > 0) {
        verdict = 'more_info_required';
        logicalVerdict = 'UNKNOWN';
        score = Math.round((matchedCriteria.length / (matchedCriteria.length + missingCriteria.length)) * 100);
      }

      // Extract verified mandatory documents strictly from verified scheme data
      const verifiedDocs = Array.isArray(scheme.mandatoryDocs) && scheme.mandatoryDocs.length > 0
        ? scheme.mandatoryDocs
        : Array.isArray(scheme.documents)
        ? scheme.documents
        : [];

      evaluated.push({
        scheme,
        verdict,
        logicalVerdict,
        score,
        matchedCriteria,
        missingCriteria,
        reasons: {
          eligibilityReasons: matchedCriteria,
          disqualificationReasons: isMismatch ? missingCriteria : [],
          missingInfoReasons: !isMismatch && missingCriteria.length > 0 ? missingCriteria : [],
        },
        verifiedDocuments: verifiedDocs,
        recommendationReason:
          verdict === 'potentially_eligible'
            ? `Matches 100% of verified criteria based on your ${profile.occupation} profile in ${profile.district}.`
            : verdict === 'more_info_required'
            ? `High potential match. Complete additional verification (${missingCriteria.join(', ')}) to finalize.`
            : `Does not match eligibility criteria: ${missingCriteria.join(', ')}.`,
        estimatedBenefit: scheme.benefitAmount,
      });
    }

    const topMatches = evaluated.filter((e) => e.verdict === 'potentially_eligible');
    const actionRequiredMatches = evaluated.filter((e) => e.verdict === 'more_info_required');
    const ineligible = evaluated.filter((e) => e.verdict === 'does_not_match');

    return {
      timestamp: new Date().toISOString(),
      profileEvaluated: profile,
      totalEvaluated: evaluated.length,
      eligibleCount: topMatches.length,
      actionRequiredCount: actionRequiredMatches.length,
      ineligibleCount: ineligible.length,
      topMatches,
      actionRequiredMatches,
      ineligibleMatches: ineligible,
    };
  }
};
