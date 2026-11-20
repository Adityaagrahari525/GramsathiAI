# GramSathi AI — Phase 3 Data Architecture

## 1. Overview

Phase 3 established a unified, strongly-typed data architecture for GramSathi AI. It consolidates scheme definitions, categorization taxonomies, and citizen profile representations into a clean service-oriented structure while maintaining strict data integrity and demonstration safety.

## 2. Directory Structure

```
client/src/
├── data/
│   ├── schemesData.ts          # Central repository of 8 normalized Maharashtra schemes
│   ├── sampleSchemes.ts        # Sample and demonstration helper definitions
│   └── mockData.ts             # Static UI mock data (synergies, scam patterns)
├── services/
│   ├── schemeService.ts        # Retrieval, category filtering, search, and details
│   ├── reverseDiscoveryService.ts # Intent matching, preset queries, and rule scoring
│   ├── eligibilityService.ts   # Deterministic 3-state profile assessment engine
│   └── savedSchemeService.ts   # Bookmark persistence and category categorization
├── types/
│   └── (Inlined & exported from data/schemesData.ts, context/, and services/)
└── context/
    ├── CitizenProfileContext.tsx # User profile, landholding, socio-economic factors
    ├── JourneyTrackerContext.tsx # 5-stage application journey state & document checklist
    ├── SavedSchemesContext.tsx   # Saved schemes portfolio with localStorage persistence
    └── ToastContext.tsx          # Accessible civic notification system
```

## 3. Scheme Model Schema

Every scheme in `client/src/data/schemesData.ts` complies with the `Scheme` interface:

```typescript
export interface Scheme {
  id: string;                                    // Unique kebab-case identifier
  name: string;                                  // Official title in English
  nameMr: string;                                // Official title in Marathi
  nameHi: string;                                // Official title in Hindi
  sector: string;                                // Category identifier (agriculture, msme, etc.)
  sectorMr: string;                              // Sector label in Marathi
  department: string;                            // Complete nodal department name
  departmentShort: string;                       // Abbreviated department name
  level: 'Maharashtra' | 'Central' | 'Joint';    // Jurisdiction
  benefitAmount: string;                         // Quantified subsidy / cash benefit
  benefits?: string;                             // Detailed textual description of benefits
  benefitType: 'cash' | 'subsidy' | 'loan' | 'scholarship' | 'employment';
  accentColor: 'emerald' | 'blue' | 'amber' | 'indigo';
  headerBadges: Array<{ text: string; variant: 'green' | 'blue' | 'amber' | 'gray' }>;
  highlightTitle: string;
  highlightText: string;
  highlightVariant: 'green' | 'blue' | 'amber' | 'purple';
  targetBeneficiaryText: string;
  mandatoryDocs: string[];
  bottomMeta: {
    icon: 'mode' | 'beneficiaries' | 'deadline' | 'location';
    text: string;
  };
  summary: string;
  description?: string;                          // Comprehensive scheme overview
  eligibility: string[];                         // Array of discrete eligibility criteria
  documents: string[];                           // Array of required documents
  applicationSteps?: string[];                   // Ordered 5-stage procedural steps
  officialUrl: string;                           // Official government portal link
  sourceUrl?: string;                            // Gazette/Resolution/GR reference URL
  tags: string[];                                // Search & matching keywords
  targetBeneficiaries: string[];                 // Demographic categories
  verified: boolean;
  verificationStatus?: 'verified' | 'unverified' | 'demonstration'; // Explicit demonstration marker
  applicationMode: string;
  lastUpdated: string;
  lastVerifiedDate?: string;                     // Audit and freshness date
  schemeNo?: string;
}
```

## 4. Curated Scheme Catalog

The centralized dataset contains 8 curated Maharashtra & central schemes:
1. **Mukhyamantri Saur Krushi Vahini Yojana (MSKVY 2.0 / PM-KUSUM B)** — 90% to 95% off-grid solar pump subsidy.
2. **PM-Kisan Samman Nidhi Yojana** — ₹6,000/yr central DBT income support.
3. **MahaDBT Post-Matric Tuition Fee & Examination Fee (EBC Scholarship)** — 50% to 100% higher education tuition reimbursement.
4. **Mukhyamantri Majhi Ladki Bahin Yojana** — ₹1,500/month direct cash assistance for women.
5. **Chief Minister Employment Generation Programme (CMEGP - MSME)** — Up to ₹50 Lakh credit-linked project assistance with 15–35% margin subsidy.
6. **Sub-Mission on Agricultural Mechanization (SMAM - Tractor Subsidy)** — ₹1.25 Lakh or up to 50% capital subsidy on agricultural equipment.
7. **Pradhan Mantri Fasal Bima Yojana (PMFBY / Pik Vima - ₹1 Scheme)** — Comprehensive crop loss insurance at nominal ₹1 citizen premium.
8. **Sanjay Gandhi Niradhar Anudan Yojana** — ₹1,500/month destitute and disability social assistance pension.

All records carry `verificationStatus: 'demonstration'`, `lastVerifiedDate: '12 Nov 2026'`, and complete 5-step procedural paths (`applicationSteps`).
