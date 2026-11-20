import type { Scheme } from './scheme.js';

export interface RecommendInput {
  query: string;
  options?: {
    eligibleOnly?: boolean;
    userHolding?: number;
    category?: string;
  };
}

export interface MatchedRecommendation {
  scheme: Scheme;
  matchScore: number;
  matchedReason: string;
  relevantEligibility: string;
  detailUrl: string;
  matchedKeywords: string[];
}

export interface RecommendResponse {
  query: string;
  totalMatches: number;
  results: MatchedRecommendation[];
}
