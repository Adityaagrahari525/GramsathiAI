export interface SchemeBadge {
  text: string;
  variant: 'green' | 'blue' | 'amber' | 'gray';
}

export interface SchemeBottomMeta {
  icon: 'mode' | 'beneficiaries' | 'deadline' | 'location';
  text: string;
}

export interface Scheme {
  id: string;
  name: string;
  nameMr: string;
  nameHi: string;
  sector: string;
  sectorMr: string;
  department: string;
  departmentShort: string;
  level: 'Maharashtra' | 'Central' | 'Joint';
  benefitAmount: string;
  benefits?: string;
  benefitType: 'cash' | 'subsidy' | 'loan' | 'scholarship' | 'employment';
  accentColor: 'emerald' | 'blue' | 'amber' | 'indigo';
  headerBadges: SchemeBadge[];
  highlightTitle: string;
  highlightText: string;
  highlightVariant: 'green' | 'blue' | 'amber' | 'purple';
  targetBeneficiaryText: string;
  mandatoryDocs: string[];
  bottomMeta: SchemeBottomMeta;
  summary: string;
  description?: string;
  eligibility: string[];
  documents: string[];
  applicationSteps?: string[];
  officialUrl: string;
  sourceUrl?: string;
  tags: string[];
  targetBeneficiaries: string[];
  verified: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'demonstration';
  applicationMode: string;
  lastUpdated: string;
  lastVerifiedDate?: string;
  schemeNo?: string;
}

export interface SchemeFilters {
  sector?: string;
  level?: 'Maharashtra' | 'Central' | 'Joint';
  benefitType?: 'cash' | 'subsidy' | 'loan' | 'scholarship' | 'employment';
  searchQuery?: string;
  limit?: number;
  offset?: number;
}
