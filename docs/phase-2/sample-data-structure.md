# GramSathi AI — Demonstration Data Structure & Service Layer
**Phase:** Phase 2 — Complete Frontend Functionality  
**Platform:** GramSathi AI (Government of Maharashtra Civic Platform)  
**Notice:** All data within this layer is explicitly categorized as **Demonstration & Prototype Data**. It models real Maharashtra civic schemas without claiming statutory legal verification.

---

## 1. Overview & Data Boundaries

In Phase 2, a robust demonstration data architecture was designed to simulate complex government welfare datasets and citizen eligibility states without calling an external backend.

### Key Principles:
1. **Clear Demonstration Attribution:** All sample schemes are marked with demonstration metadata.
2. **Realistic Maharashtra Context:** Schemes, departments, and Government Resolutions (GRs) reflect authentic civic programs (MahaDBT, PM-KUSUM, PMKSY, Dr. Ambedkar Krishi Swavalamban, Ramai Awas).
3. **Strict Type Safety:** All entities are governed by explicit TypeScript interfaces.
4. **Decoupled Service Layer:** Frontend pages consume data strictly through services (`SchemeService`, `EligibilityService`), preparing the application for drop-in API replacement in Phase 3.

---

## 2. Core TypeScript Interfaces

### 2.1 Scheme Model (`client/src/data/schemesData.ts`)

```typescript
export interface Scheme {
  id: string;
  name: string;
  nameMr?: string;
  department: string;
  departmentMr?: string;
  category: 'agriculture' | 'social-welfare' | 'housing' | 'education' | 'women-child';
  level: 'State' | 'Central' | 'Joint';
  description: string;
  descriptionMr?: string;
  benefits: string;
  benefitsHighlight: string;
  benefitsMr?: string;
  subsidyPercentage?: number;
  subsidyMaxAmount?: string;
  eligibility: string[];
  eligibilityStructured: {
    minAge?: number;
    maxAge?: number;
    gender?: 'All' | 'Female' | 'Male';
    categories?: string[]; // e.g. ['SC', 'ST', 'OBC', 'Open']
    maxIncome?: number;    // Annual income ceiling in INR
    minLandholding?: number; // In Acres
    maxLandholding?: number;
    requiresWaterSource?: boolean;
    disabilityOnly?: boolean;
  };
  exclusions: string[];
  documents: {
    name: string;
    isMandatory: boolean;
    source?: string; // e.g. "DigiLocker", "MahaBhumi", "Aaple Sarkar"
  }[];
  applicationMode: 'Online' | 'Offline' | 'CSC / Seva Kendra';
  officialUrl: string;
  grReference: string;
  lastVerified: string;
  timelineEstimate: string;
  isPopular?: boolean;
}
```

### 2.2 Citizen Profile Model (`client/src/context/CitizenProfileContext.tsx`)

```typescript
export interface CitizenProfile {
  name: string;
  nameMr?: string;
  mobile: string;
  gender: string;
  age: number;
  dob?: string;
  socialCategory: string; // 'OBC' | 'SC' | 'ST' | 'General' | 'NT/VJNT'
  occupation: string;
  landholding: string;    // 'Small / Marginal (< 5 Acres)' | 'Large' | 'Landless'
  landholdingAcres: number;
  waterSource: string;    // 'Dug Well' | 'Borewell' | 'Farm Pond' | 'None'
  incomeSlab: string;     // '< 1.5 Lakh' | '1.5L - 2.5L' | '2.5L - 8L'
  state: string;          // Default: 'Maharashtra'
  district: string;       // Default: 'Pune'
  taluka: string;         // Default: 'Baramati'
  village: string;        // Default: 'Malegaon Budruk'
  pincode: string;        // Default: '413115'
  farmerId: string;       // e.g. 'MH-PUN-BAR-2024-849102'
  aadhaarMasked: string;  // e.g. 'XXXX-XXXX-5921'
  hasElectricPump: boolean;
  hasJointHolding: boolean;
  focusAreas: Record<string, boolean>;
  isLoggedIn: boolean;
}
```

### 2.3 Journey & Document Models (`client/src/context/JourneyTrackerContext.tsx`)

```typescript
export interface DocumentItem {
  id: string;
  title: string;
  titleMr: string;
  status: 'Ready' | 'Pending' | 'Uploaded';
  subtext: string;
  source: string;
  fileUrl?: string;
}

export interface SchemeJourney {
  schemeId: string;
  schemeTitle: string;
  currentStage: 1 | 2 | 3 | 4 | 5;
  stageName: string;
  totalStages: number;
  readyDocuments: number;
  totalDocuments: number;
  overallProgressPercentage: number;
  documents: DocumentItem[];
  digiLockerSynced: boolean;
  uploaded8A: boolean;
}
```

### 2.4 Eligibility Evaluation Model (`client/src/services/eligibilityService.ts`)

```typescript
export interface EvaluatedScheme {
  scheme: Scheme;
  verdict: 'potentially_eligible' | 'does_not_match' | 'more_info_required';
  score: number; // 0 to 100 percentage
  matchedCriteria: string[];
  missingCriteria: string[];
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
}
```

---

## 3. Sample Schemes Included in Demonstration Catalog

| Scheme ID | Scheme Title | Department | Primary Benefit |
| :--- | :--- | :--- | :--- |
| `saur-krushi-vahini` | **Mukhyamantri Saur Krushi Vahini Yojana 2.0 (PM-KUSUM)** | Energy & Agriculture | 90%–95% Capital Subsidy on 3 HP / 5 HP Solar Water Pumps. Farmer contribution only ₹16,500 – ₹22,400. |
| `dr-ambedkar-krishi` | **Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana** | Social Justice & Special Assistance | Up to ₹4,00,000 for new wells, borewell energization, and micro-irrigation for SC/Neo-Buddhist farmers. |
| `ramai-awas` | **Ramai Awas Gharkul Yojana (Rural Housing Scheme)** | Rural Development & Housing | Direct grant of ₹1,30,000 in 3 installments for permanent pucca houses for rural homeless families. |
| `pm-kisan-mahadbt` | **Namo Shetkari Mahasanman Nidhi + PM-KISAN** | Agriculture & Farmers Welfare | ₹12,000 annual direct income support credited in 3 equal quarterly installments of ₹4,000. |
| `majhi-ladki-bahin` | **Mukhyamantri Majhi Ladki Bahin Yojana** | Women & Child Development | ₹1,500 monthly DBT financial assistance to eligible women aged 21–65 years. |

---

## 4. Default Demonstration Citizen Persona

To ensure realistic user testing across the application without requiring instant manual data entry, a standard Maharashtra farmer persona is pre-loaded:

- **Name:** Ramesh Dattatray Gaikwad (रमेश दत्तात्रय गायकवाड)
- **Identity:** Male, 46 years, Aadhaar `XXXX-XXXX-5921`
- **Location:** Malegaon Budruk, Baramati Taluka, Pune District, PIN 413115
- **Socio-Economic Profile:** OBC (Non-Creamy Layer), Annual Family Income < ₹1.5 Lakh
- **Landholding & Infrastructure:** 2.50 Acres (Small Farmer), Perennial Dug Well registered on 7/12 extract, No existing grid agricultural electric pump.
- **Document Status:** 7/12 land extract verified, Aadhaar NPCI bank-linked, OBC caste certificate valid, Bank of Maharashtra passbook verified, 8-A land extract pending QR verification.

---

## 5. Persistence Strategy

- **Browser `localStorage` Keys:**
  - `gramsathi_citizen_profile`: Stores active citizen demographic profile.
  - `gramsathi_saved_schemes`: Stores array of saved scheme IDs.
  - `gramsathi_journey_tracker`: Stores active 5-stage application state and document readiness.
- **Security & Privacy Boundary:**
  - Prototype data only.
  - **No unmasked Aadhaar numbers, passwords, JWT secrets, or actual identity documents are stored in browser storage.**
