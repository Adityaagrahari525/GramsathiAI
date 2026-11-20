import { IScheme, IStructuredEligibility } from '../models/Scheme.js';

/**
 * Citizen Profile representation for eligibility evaluation
 */
export interface CitizenProfile {
  age?: number | null;
  gender?: 'male' | 'female' | 'transgender' | 'all' | null;
  caste?: string | null; // E.g. 'OBC', 'SC', 'ST', 'General', 'VJNT', 'SEBC', 'EWS'
  annualFamilyIncome?: number | null; // In INR
  state?: string | null; // E.g. 'Maharashtra'
  residence?: 'rural' | 'urban' | null;
  hasDisability?: boolean | null;
  isBpl?: boolean | null;
  agriculturalLandholdingAcres?: number | null;
  hasWaterSource?: boolean | null;
  hasExistingSolarPump?: boolean | null;
  hasConventionalGridConnection?: boolean | null;
}

/**
 * Result evaluation outcome types
 */
export type EligibilityStatus =
  | 'potentially_eligible'
  | 'does_not_match'
  | 'more_info_required';

export interface CriterionCheckResult {
  field: string;
  criterionDescription: string;
  passed: boolean;
  status: 'passed' | 'failed' | 'missing_citizen_data' | 'missing_scheme_data';
  details: string;
}

export interface EligibilityEvaluationReport {
  schemeId: string;
  schemeName: string;
  status: EligibilityStatus;
  statusText: string;
  summary: string;
  matchedCriteria: CriterionCheckResult[];
  failedCriteria: CriterionCheckResult[];
  missingCriteria: CriterionCheckResult[];
  confidenceScore: number; // 0.0 to 1.0 based on criteria clarity and verified data
}

/**
 * Deterministic Eligibility Evaluation Engine
 * Strictly rule-based; never guesses, assumes, or hallucinates criteria.
 */
export class EligibilityEngine {
  /**
   * Evaluate a citizen profile against a single scheme's structured criteria
   */
  public static evaluate(
    scheme: Pick<IScheme, 'schemeId' | 'name' | 'state' | 'eligibility'>,
    profile: CitizenProfile
  ): EligibilityEvaluationReport {
    const rules: IStructuredEligibility = scheme.eligibility.structured;
    const checks: CriterionCheckResult[] = [];

    // 1. STATE & RESIDENCE CHECK
    if (rules.states && rules.states.length > 0 && !rules.states.includes('All')) {
      if (!profile.state) {
        checks.push({
          field: 'state',
          criterionDescription: `Must be resident of: ${rules.states.join(', ')}`,
          passed: false,
          status: 'missing_citizen_data',
          details: 'Citizen profile state is not provided.',
        });
      } else {
        const matchesState = rules.states.some(
          (s) => s.toLowerCase() === profile.state?.toLowerCase()
        );
        checks.push({
          field: 'state',
          criterionDescription: `Must be resident of: ${rules.states.join(', ')}`,
          passed: matchesState,
          status: matchesState ? 'passed' : 'failed',
          details: matchesState
            ? `Resident of eligible state (${profile.state}).`
            : `Resident of ${profile.state}, but scheme requires ${rules.states.join(', ')}.`,
        });
      }
    }

    // Residence (Rural / Urban)
    if (rules.residence && rules.residence !== 'all') {
      if (!profile.residence) {
        checks.push({
          field: 'residence',
          criterionDescription: `Target residence: ${rules.residence}`,
          passed: false,
          status: 'missing_citizen_data',
          details: 'Citizen rural/urban residence type not provided.',
        });
      } else {
        const matchesResidence = profile.residence === rules.residence;
        checks.push({
          field: 'residence',
          criterionDescription: `Target residence: ${rules.residence}`,
          passed: matchesResidence,
          status: matchesResidence ? 'passed' : 'failed',
          details: matchesResidence
            ? `Matches residence requirement (${rules.residence}).`
            : `Citizen is ${profile.residence}, but scheme requires ${rules.residence}.`,
        });
      }
    }

    // 2. GENDER CHECK
    if (rules.gender && rules.gender !== 'all') {
      if (!profile.gender) {
        checks.push({
          field: 'gender',
          criterionDescription: `Target gender: ${rules.gender}`,
          passed: false,
          status: 'missing_citizen_data',
          details: 'Gender is not specified in profile.',
        });
      } else {
        const matchesGender = profile.gender.toLowerCase() === rules.gender.toLowerCase();
        checks.push({
          field: 'gender',
          criterionDescription: `Target gender: ${rules.gender}`,
          passed: matchesGender,
          status: matchesGender ? 'passed' : 'failed',
          details: matchesGender
            ? `Gender (${profile.gender}) meets requirements.`
            : `Restricted to ${rules.gender}; applicant is ${profile.gender}.`,
        });
      }
    }

    // 3. AGE LIMITS CHECK
    if (rules.ageMin !== null || rules.ageMax !== null) {
      if (profile.age === null || profile.age === undefined) {
        checks.push({
          field: 'age',
          criterionDescription: `Age between ${rules.ageMin ?? 'Any'} and ${rules.ageMax ?? 'Any'} years`,
          passed: false,
          status: 'missing_citizen_data',
          details: 'Citizen age not specified in profile.',
        });
      } else {
        const meetsMin = rules.ageMin === null || profile.age >= rules.ageMin;
        const meetsMax = rules.ageMax === null || profile.age <= rules.ageMax;
        const passedAge = meetsMin && meetsMax;

        checks.push({
          field: 'age',
          criterionDescription: `Age between ${rules.ageMin ?? 'Any'} and ${rules.ageMax ?? 'Any'} years`,
          passed: passedAge,
          status: passedAge ? 'passed' : 'failed',
          details: passedAge
            ? `Age (${profile.age} yrs) is within eligible range.`
            : `Age (${profile.age} yrs) violates limit (Min: ${rules.ageMin ?? '-'}, Max: ${rules.ageMax ?? '-'}).`,
        });
      }
    }

    // 4. CASTE / SOCIAL CATEGORY CHECK
    if (rules.caste && rules.caste.length > 0 && !rules.caste.includes('All')) {
      if (!profile.caste) {
        checks.push({
          field: 'caste',
          criterionDescription: `Eligible social categories: ${rules.caste.join(', ')}`,
          passed: false,
          status: 'missing_citizen_data',
          details: 'Social category / caste is not declared.',
        });
      } else {
        const matchesCaste = rules.caste.some(
          (c) => c.toLowerCase() === profile.caste?.toLowerCase()
        );
        checks.push({
          field: 'caste',
          criterionDescription: `Eligible social categories: ${rules.caste.join(', ')}`,
          passed: matchesCaste,
          status: matchesCaste ? 'passed' : 'failed',
          details: matchesCaste
            ? `Category (${profile.caste}) is covered under scheme quota.`
            : `Category (${profile.caste}) is not in eligible quotas (${rules.caste.join(', ')}).`,
        });
      }
    }

    // 5. ANNUAL INCOME LIMIT CHECK
    if (rules.incomeMax !== null) {
      if (profile.annualFamilyIncome === null || profile.annualFamilyIncome === undefined) {
        checks.push({
          field: 'income',
          criterionDescription: `Annual family income must be ≤ ₹${rules.incomeMax.toLocaleString('en-IN')}`,
          passed: false,
          status: 'missing_citizen_data',
          details: 'Annual family income not specified.',
        });
      } else {
        const passedIncome = profile.annualFamilyIncome <= rules.incomeMax;
        checks.push({
          field: 'income',
          criterionDescription: `Annual family income must be ≤ ₹${rules.incomeMax.toLocaleString('en-IN')}`,
          passed: passedIncome,
          status: passedIncome ? 'passed' : 'failed',
          details: passedIncome
            ? `Income (₹${profile.annualFamilyIncome.toLocaleString('en-IN')}) is within ceiling (₹${rules.incomeMax.toLocaleString('en-IN')}).`
            : `Income (₹${profile.annualFamilyIncome.toLocaleString('en-IN')}) exceeds ceiling (₹${rules.incomeMax.toLocaleString('en-IN')}).`,
        });
      }
    }

    // 6. DISABILITY REQUIREMENT CHECK
    if (rules.disabilityRequired === true) {
      if (profile.hasDisability === null || profile.hasDisability === undefined) {
        checks.push({
          field: 'disability',
          criterionDescription: 'Applicant must have a registered benchmark disability (Divyangjan)',
          passed: false,
          status: 'missing_citizen_data',
          details: 'Disability status not provided.',
        });
      } else {
        checks.push({
          field: 'disability',
          criterionDescription: 'Applicant must have a registered benchmark disability (Divyangjan)',
          passed: profile.hasDisability === true,
          status: profile.hasDisability === true ? 'passed' : 'failed',
          details: profile.hasDisability === true
            ? 'Disability criterion verified.'
            : 'Scheme is dedicated exclusively to persons with disabilities (Divyangjan).',
        });
      }
    }

    // 7. BELOW POVERTY LINE (BPL) CHECK
    if (rules.bplRequired === true) {
      if (profile.isBpl === null || profile.isBpl === undefined) {
        checks.push({
          field: 'bpl',
          criterionDescription: 'Must possess BPL / Antyodaya ration card or SECC poverty status',
          passed: false,
          status: 'missing_citizen_data',
          details: 'BPL / Ration card category not specified.',
        });
      } else {
        checks.push({
          field: 'bpl',
          criterionDescription: 'Must possess BPL / Antyodaya ration card or SECC poverty status',
          passed: profile.isBpl === true,
          status: profile.hasDisability === true ? 'passed' : 'failed',
          details: profile.isBpl === true
            ? 'BPL priority household status confirmed.'
            : 'Scheme strictly requires BPL / Antyodaya status.',
        });
      }
    }

    // 8. LANDHOLDING CEILING (Agricultural schemes)
    if (rules.landholdingMaxAcres !== null) {
      if (
        profile.agriculturalLandholdingAcres === null ||
        profile.agriculturalLandholdingAcres === undefined
      ) {
        checks.push({
          field: 'landholding',
          criterionDescription: `Landholding must be ≤ ${rules.landholdingMaxAcres} acres`,
          passed: false,
          status: 'missing_citizen_data',
          details: 'Agricultural landholding size not specified.',
        });
      } else {
        const passedLand = profile.agriculturalLandholdingAcres <= rules.landholdingMaxAcres;
        checks.push({
          field: 'landholding',
          criterionDescription: `Landholding must be ≤ ${rules.landholdingMaxAcres} acres`,
          passed: passedLand,
          status: passedLand ? 'passed' : 'failed',
          details: passedLand
            ? `Landholding (${profile.agriculturalLandholdingAcres} acres) satisfies limit.`
            : `Landholding (${profile.agriculturalLandholdingAcres} acres) exceeds ${rules.landholdingMaxAcres} acres limit.`,
        });
      }
    }

    // Partition checks into 3 categories
    const matchedCriteria = checks.filter((c) => c.status === 'passed');
    const failedCriteria = checks.filter((c) => c.status === 'failed');
    const missingCriteria = checks.filter((c) => c.status === 'missing_citizen_data');

    // Determine Final Status (Strict 3-State Rule)
    let status: EligibilityStatus;
    let statusText: string;
    let summary: string;

    if (failedCriteria.length > 0) {
      status = 'does_not_match';
      statusText = 'Does not match available criteria';
      summary = `Citizen does not qualify due to ${failedCriteria.length} criterion restriction(s): ${failedCriteria.map((f) => f.field).join(', ')}.`;
    } else if (missingCriteria.length > 0) {
      status = 'more_info_required';
      statusText = 'More information required';
      summary = `Potentially matches ${matchedCriteria.length} criteria, but ${missingCriteria.length} profile parameter(s) must be verified (${missingCriteria.map((m) => m.field).join(', ')}).`;
    } else {
      status = 'potentially_eligible';
      statusText = 'Potentially eligible';
      summary = `All ${matchedCriteria.length} verified eligibility rules are satisfied by the citizen profile.`;
    }

    // Confidence Calculation
    const totalChecks = checks.length;
    const confidenceScore =
      totalChecks === 0 ? 0.5 : Number((matchedCriteria.length / totalChecks).toFixed(2));

    return {
      schemeId: scheme.schemeId,
      schemeName: scheme.name,
      status,
      statusText,
      summary,
      matchedCriteria,
      failedCriteria,
      missingCriteria,
      confidenceScore,
    };
  }
}
