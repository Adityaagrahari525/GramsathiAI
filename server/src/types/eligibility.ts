import type { Scheme } from './scheme.js';

export interface CitizenProfileInput {
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  pinCode?: string;
  occupation?: string;
  socialCategory?: string;
  landholding?: string;
  landholdingAcres?: number;
  incomeSlab?: string;
  waterSource?: string;
  hasElectricPump?: boolean;
  hasAadhaarLinkedBank?: boolean;
}

export interface EvaluatedSchemeResult {
  scheme: Scheme;
  verdict: 'potentially_eligible' | 'does_not_match' | 'more_info_required';
  score: number;
  matchedCriteria: string[];
  missingCriteria: string[];
  recommendationReason: string;
  estimatedBenefit: string;
}

export interface EligibilityCheckResponse {
  timestamp: string;
  profileEvaluated: CitizenProfileInput;
  totalEvaluated: number;
  eligibleCount: number;
  actionRequiredCount: number;
  ineligibleCount: number;
  topMatches: EvaluatedSchemeResult[];
  actionRequiredMatches: EvaluatedSchemeResult[];
}
