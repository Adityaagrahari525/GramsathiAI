import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Structured eligibility sub-document interface
 */
export interface IStructuredEligibility {
  ageMin: number | null;
  ageMax: number | null;
  gender: 'all' | 'male' | 'female' | 'transgender' | null;
  caste: string[] | null; // e.g. ['SC', 'ST', 'OBC', 'General', 'VJNT']
  incomeMax: number | null; // In Indian Rupees (INR) per annum
  residence: 'all' | 'rural' | 'urban' | null;
  states: string[]; // e.g. ['Maharashtra'] or ['All']
  disabilityRequired: boolean | null;
  bplRequired: boolean | null;
  landholdingMaxAcres: number | null;
  otherConditions: string[];
}

/**
 * Main Scheme document interface
 */
export interface IScheme extends Document {
  schemeId: string; // Unique human-readable or slug identifier
  slug: string; // Canonical URL slug
  name: string; // Official scheme name in English
  nameLocal?: string | null; // Official name in Marathi (मराठी) / Hindi
  description: string; // Detailed scheme overview and objectives
  level: 'Central' | 'State' | 'Joint'; // Level of Government
  state: string; // Nodal State (e.g. 'Maharashtra' or 'Central')
  ministry?: string | null; // Central Ministry if applicable
  department: string; // Nodal State Department or Authority
  category: string[]; // Functional categories: Agriculture, Education, Housing, etc.
  
  benefits: {
    rawText: string;
    type?: 'subsidy' | 'cash_dbt' | 'loan' | 'scholarship' | 'in_kind' | 'insurance' | null;
    estimatedValue?: number | null; // In INR if quantified
    percentage?: number | null; // E.g. 90% subsidy
    summary?: string | null;
  };

  eligibility: {
    rawText: string; // Untampered original eligibility text
    structured: IStructuredEligibility; // Machine-readable rules for deterministic matching
    exclusions: string[]; // Explicit ineligibility rules
  };

  documents: {
    rawText: string; // Untampered original documents requirement text
    mandatory: string[]; // Verified mandatory documents
    optional: string[]; // Optional or category-conditional documents
  };

  application: {
    mode: 'online' | 'offline' | 'both' | 'not_specified';
    processSteps: string[];
    applyUrl: string | null; // Direct registration / application URL
    officialPortalUrl: string | null; // Department or official scheme portal URL
  };

  governance: {
    grReference: string | null; // Official Government Resolution (शासन निर्णय) reference
    lastVerifiedDate: Date | null; // Timestamp when criteria was officially verified
    dataCollectionSource: string; // E.g. 'myscheme.gov.in', 'mahadbt.maharashtra.gov.in'
    officialSourceUrl: string; // Direct link to official source portal
    verificationStatus: 'officially_verified' | 'unverified_third_party' | 'pending_gazette_audit';
    auditNotes?: string | null;
  };

  tags: string[];
  // Phase 3/4 unified fields
  id?: string;
  sector?: string;
  sectorMr?: string;
  nameHi?: string;
  departmentShort?: string;
  benefitAmount?: string;
  benefitType?: string;
  accentColor?: string;
  headerBadges?: any[];
  highlightTitle?: string;
  highlightText?: string;
  highlightVariant?: string;
  targetBeneficiaryText?: string;
  mandatoryDocs?: string[];
  bottomMeta?: any;
  summary?: string;
  applicationSteps?: string[];
  officialUrl?: string;
  sourceUrl?: string;
  targetBeneficiaries?: string[];
  verified?: boolean;
  verificationStatus?: string;
  applicationMode?: string;
  lastUpdated?: string;
  lastVerifiedDate?: string;
  schemeNo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StructuredEligibilitySchema = new Schema<IStructuredEligibility>(
  {
    ageMin: { type: Number, default: null },
    ageMax: { type: Number, default: null },
    gender: {
      type: String,
      enum: ['all', 'male', 'female', 'transgender', null],
      default: null,
    },
    caste: { type: [String], default: null },
    incomeMax: { type: Number, default: null },
    residence: {
      type: String,
      enum: ['all', 'rural', 'urban', null],
      default: null,
    },
    states: { type: [String], default: ['All'] },
    disabilityRequired: { type: Boolean, default: null },
    bplRequired: { type: Boolean, default: null },
    landholdingMaxAcres: { type: Number, default: null },
    otherConditions: { type: [String], default: [] },
  },
  { _id: false }
);

export const SchemeSchema = new Schema<IScheme>(
  {
    schemeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    nameLocal: {
      type: String,
      default: null,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ['Central', 'State', 'Joint'],
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ministry: {
      type: String,
      default: null,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: [String],
      required: true,
      index: true,
    },
    benefits: {
      rawText: { type: String, required: true },
      type: {
        type: String,
        enum: ['subsidy', 'cash_dbt', 'loan', 'scholarship', 'in_kind', 'insurance', null],
        default: null,
      },
      estimatedValue: { type: Number, default: null },
      percentage: { type: Number, default: null },
      summary: { type: String, default: null },
    },
    eligibility: {
      rawText: { type: String, required: true },
      structured: { type: StructuredEligibilitySchema, required: true },
      exclusions: { type: [String], default: [] },
    },
    documents: {
      rawText: { type: String, required: true },
      mandatory: { type: [String], default: [] },
      optional: { type: [String], default: [] },
    },
    application: {
      mode: {
        type: String,
        enum: ['online', 'offline', 'both', 'not_specified'],
        default: 'not_specified',
      },
      processSteps: { type: [String], default: [] },
      applyUrl: { type: String, default: null, trim: true },
      officialPortalUrl: { type: String, default: null, trim: true },
    },
    governance: {
      grReference: { type: String, default: null, trim: true },
      lastVerifiedDate: { type: Date, default: null },
      dataCollectionSource: { type: String, required: true, trim: true },
      officialSourceUrl: { type: String, required: true, trim: true },
      verificationStatus: {
        type: String,
        enum: ['officially_verified', 'unverified_third_party', 'pending_gazette_audit'],
        default: 'unverified_third_party',
        index: true,
      },
      auditNotes: { type: String, default: null },
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    // Phase 3/4 & REST API unified fields
    id: { type: String, sparse: true, index: true },
    sector: { type: String, sparse: true, index: true },
    sectorMr: { type: String, default: '' },
    nameHi: { type: String, default: '' },
    departmentShort: { type: String, default: '' },
    benefitAmount: { type: String, default: '' },
    benefitType: { type: String, default: 'subsidy' },
    accentColor: { type: String, default: 'blue' },
    headerBadges: { type: [Schema.Types.Mixed], default: [] },
    highlightTitle: { type: String, default: '' },
    highlightText: { type: String, default: '' },
    highlightVariant: { type: String, default: 'blue' },
    targetBeneficiaryText: { type: String, default: '' },
    mandatoryDocs: { type: [String], default: [] },
    bottomMeta: { type: Schema.Types.Mixed, default: {} },
    summary: { type: String, default: '' },
    applicationSteps: { type: [String], default: [] },
    officialUrl: { type: String, default: '' },
    sourceUrl: { type: String, default: '' },
    targetBeneficiaries: { type: [String], default: [] },
    verified: { type: Boolean, default: true },
    verificationStatus: { type: String, default: 'demonstration' },
    applicationMode: { type: String, default: 'Online' },
    lastUpdated: { type: String, default: 'Nov 2026' },
    lastVerifiedDate: { type: String, default: '2026-11-15' },
    schemeNo: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high-throughput citizen matching queries
SchemeSchema.index({ state: 1, 'governance.verificationStatus': 1 });
SchemeSchema.index({ 'eligibility.structured.incomeMax': 1 });
SchemeSchema.index({ 'eligibility.structured.gender': 1 });
SchemeSchema.index({ category: 1, state: 1 });

export const Scheme: Model<IScheme> =
  mongoose.models.Scheme || mongoose.model<IScheme>('Scheme', SchemeSchema);
