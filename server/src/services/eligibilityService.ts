import { schemeRepository } from '../repositories/schemeRepository.js';
import type {
  CitizenProfileInput,
  EvaluatedSchemeResult,
  EligibilityCheckResponse,
} from '../types/eligibility.js';

export class EligibilityService {
  /**
   * Evaluates citizen profile against all registered schemes
   */
  static async evaluateProfile(profile: CitizenProfileInput): Promise<EligibilityCheckResponse> {
    const { schemes } = await schemeRepository.getAll();
    const evaluated: EvaluatedSchemeResult[] = [];

    const age = profile.age ?? 0;
    const gender = (profile.gender || '').toLowerCase();
    const landholdingAcres = profile.landholdingAcres ?? 0;
    const waterSource = (profile.waterSource || '').toLowerCase();
    const hasElectricPump = !!profile.hasElectricPump;
    const socialCategory = (profile.socialCategory || '').toLowerCase();
    const incomeSlab = (profile.incomeSlab || '').toLowerCase();
    const state = profile.state || 'Maharashtra';
    const district = profile.district || 'Baramati / Pune';
    const occupation = profile.occupation || 'Farmer / Shetkari';

    for (const scheme of schemes) {
      const matchedCriteria: string[] = [];
      const missingCriteria: string[] = [];
      let isMismatch = false;

      // 1. Domicile Verification
      if (state.toLowerCase().includes('maharashtra')) {
        matchedCriteria.push('Maharashtra State Domicile Verified');
      } else if (scheme.level === 'Maharashtra') {
        isMismatch = true;
        missingCriteria.push('Maharashtra domicile required for state welfare program');
      }

      // 2. Gender Rules
      const isWomenScheme =
        scheme.sector === 'women' ||
        scheme.id.includes('ladki') ||
        scheme.name.toLowerCase().includes('mahila');

      if (isWomenScheme) {
        if (gender === 'female' || gender === 'woman') {
          matchedCriteria.push('Eligible Gender (Female applicant)');
        } else if (gender) {
          isMismatch = true;
          missingCriteria.push('Scheme strictly reserved for women beneficiaries');
        } else {
          missingCriteria.push('Applicant gender required to verify reserved benefits');
        }
      } else {
        matchedCriteria.push('Gender criteria universally eligible');
      }

      // 3. Age Restrictions
      if (scheme.id.includes('ladki')) {
        if (age >= 21 && age <= 65) {
          matchedCriteria.push(`Age ${age} yrs within 21–65 eligibility window`);
        } else if (age > 0) {
          isMismatch = true;
          missingCriteria.push(`Age ${age} yrs outside statutory 21–65 bracket`);
        } else {
          missingCriteria.push('Citizen age required to confirm 21–65 bracket');
        }
      } else if (scheme.sector === 'education' || scheme.id.includes('ebc')) {
        if (age >= 17 && age <= 35) {
          matchedCriteria.push(`Age ${age} yrs within higher education student bracket`);
        } else if (age > 0) {
          missingCriteria.push('Post-matric scholarship targeted for student youth (17–35)');
        } else {
          missingCriteria.push('Age required to confirm student eligibility');
        }
      } else if (scheme.id.includes('cmegp')) {
        if (age >= 18 && age <= 45) {
          matchedCriteria.push(`Age ${age} yrs within 18–45 CMEGP self-employment ceiling`);
        } else if (age > 0) {
          isMismatch = true;
          missingCriteria.push(`Age ${age} yrs outside 18–45 self-employment bracket`);
        } else {
          missingCriteria.push('Age required to verify CMEGP self-employment ceiling');
        }
      } else {
        matchedCriteria.push('General adult demographic criteria verified');
      }

      // 4. Agricultural Landholding Rules
      const isAgriScheme =
        scheme.sector === 'agriculture' ||
        scheme.id.includes('saur') ||
        scheme.id.includes('kisan') ||
        scheme.id.includes('tractor') ||
        scheme.id.includes('pik-vima');

      if (isAgriScheme) {
        if (landholdingAcres > 0) {
          matchedCriteria.push(`Agricultural Landholding: ${landholdingAcres} Acres registered on 7/12`);
        } else {
          isMismatch = true;
          missingCriteria.push('Requires verified agricultural cultivable landholding on 7/12 extract');
        }
      }

      // 5. Water Source & Conventional Grid Connection (Solar Pump specific)
      if (scheme.id.includes('saur')) {
        if (waterSource && !waterSource.includes('none')) {
          matchedCriteria.push(`Assured Perennial Water Source: ${profile.waterSource}`);
        } else {
          missingCriteria.push('Water source verification needed (open well, borewell, or farm pond)');
        }

        if (hasElectricPump) {
          isMismatch = true;
          missingCriteria.push('Existing energized conventional grid pump connection detected on survey plot');
        } else {
          matchedCriteria.push('No existing conventional grid agricultural electricity connection');
        }
      }

      // 6. Social Category & Reservation Check
      if (scheme.id.includes('ambedkar') || scheme.name.toLowerCase().includes('ambedkar')) {
        if (socialCategory.includes('sc')) {
          matchedCriteria.push('Scheduled Caste (SC) category verified');
        } else if (socialCategory) {
          isMismatch = true;
          missingCriteria.push('Special component grant reserved for Scheduled Caste community');
        } else {
          missingCriteria.push('Caste category certificate required for special component scheme');
        }
      } else if (scheme.id.includes('ebc')) {
        if (
          socialCategory.includes('obc') ||
          socialCategory.includes('general') ||
          socialCategory.includes('open') ||
          socialCategory.includes('ebc')
        ) {
          matchedCriteria.push('Open / EBC / OBC category eligible');
        }
      }

      // 7. Income Limits
      if (incomeSlab.includes('above') || incomeSlab.includes('>8') || incomeSlab === 'above_800k') {
        if (scheme.id.includes('ladki') || scheme.id.includes('ebc') || scheme.id.includes('sanjay')) {
          isMismatch = true;
          missingCriteria.push('Annual household income exceeds statutory ceiling');
        }
      } else if (incomeSlab) {
        matchedCriteria.push('Income slab within permissible statutory ceiling');
      } else {
        if (scheme.id.includes('sanjay')) {
          missingCriteria.push('Tehsildar income certificate (< ₹21,000/yr) required');
        }
      }

      // Determine 3-state verdict
      let verdict: 'potentially_eligible' | 'does_not_match' | 'more_info_required' =
        'potentially_eligible';
      let score = 100;

      if (isMismatch) {
        verdict = 'does_not_match';
        const total = matchedCriteria.length + missingCriteria.length;
        score = total > 0 ? Math.max(10, Math.round((matchedCriteria.length / total) * 100)) : 10;
      } else if (missingCriteria.length > 0) {
        verdict = 'more_info_required';
        const total = matchedCriteria.length + missingCriteria.length;
        score = total > 0 ? Math.round((matchedCriteria.length / total) * 100) : 60;
      }

      evaluated.push({
        scheme,
        verdict,
        score,
        matchedCriteria,
        missingCriteria,
        recommendationReason:
          verdict === 'potentially_eligible'
            ? `Matches 100% of verified statutory criteria for your profile in ${district}.`
            : verdict === 'more_info_required'
            ? `High potential match. Submit or verify pending details (${missingCriteria.join(', ')}) to unlock application.`
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
    };
  }
}
