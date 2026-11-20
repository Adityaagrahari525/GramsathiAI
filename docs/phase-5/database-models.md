# GramSathi AI — Database Models & Schema Specifications

## 1. User Model (`server/src/models/User.ts`)
The `User` collection manages authenticated citizens and VLE operators.

### Strict Civic Privacy Safeguards
- **Zero Aadhaar Storage**: In compliance with UIDAI guidelines, GramSathi AI **never** collects, receives, or stores 12-digit Aadhaar numbers in any database field or token. Masked demonstration values (e.g. `**** **** 8921`) are strictly client-side UI representations.
- **Hidden Password Hashes**: `passwordHash` is configured with `select: false` so database queries never leak password hashes by default.

```typescript
export interface IUser extends Document {
  name: string;
  nameMr?: string;
  phone: string;
  email?: string;
  passwordHash?: string;
  district: string;
  taluka: string;
  village?: string;
  preferredLanguage: 'mr' | 'hi' | 'en';
  interests: string[];
  role: 'citizen' | 'vle';
  gender?: string;
  occupation?: string;
  landholdingAcres?: number;
  socialCategory?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 2. Scheme Model (`server/src/models/Scheme.ts`)
Stores verified Maharashtra government schemes with both structured eligibility matching parameters and rich civic UI metadata.

```typescript
export interface IScheme extends Document {
  schemeId: string;
  slug: string;
  name: string;
  nameLocal?: string;
  description: string;
  level: 'Central' | 'State' | 'Joint';
  state: string;
  department: string;
  category: string[];
  benefits: {
    rawText: string;
    type?: 'subsidy' | 'cash_dbt' | 'loan' | 'scholarship';
    summary?: string;
  };
  eligibility: {
    rawText: string;
    structured: IStructuredEligibility;
    exclusions: string[];
  };
  documents: {
    rawText: string;
    mandatory: string[];
    optional: string[];
  };
  application: {
    mode: 'online' | 'offline' | 'both';
    processSteps: string[];
    applyUrl: string | null;
    officialPortalUrl: string | null;
  };
  governance: {
    lastVerifiedDate: Date;
    dataCollectionSource: string;
    officialSourceUrl: string;
    verificationStatus: 'officially_verified' | 'unverified_third_party';
  };
}
```

---

## 3. SavedScheme Model (`server/src/models/SavedScheme.ts`)
Tracks bookmarks per citizen. Uses a compound unique index to prevent duplicate entries:

```typescript
export interface ISavedScheme extends Document {
  userId: string;
  schemeId: string;
  savedAt: Date;
}

// Compound unique index
SavedSchemeSchema.index({ userId: 1, schemeId: 1 }, { unique: true });
```

---

## 4. Journey Model (`server/src/models/Journey.ts`)
Tracks 5-stage application progression for a citizen per scheme:

```typescript
export interface IJourney extends Document {
  userId: string;
  schemeId: string;
  currentStage: number; // 1 to 5
  completedStages: number[];
  status: 'in_progress' | 'completed' | 'on_hold';
  updatedAt: Date;
}

// Compound unique index
JourneySchema.index({ userId: 1, schemeId: 1 }, { unique: true });
```
