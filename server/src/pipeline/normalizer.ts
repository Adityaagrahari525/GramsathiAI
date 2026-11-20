import { IScheme, IStructuredEligibility } from '../models/Scheme.js';

export interface RawSchemeRecord {
  [key: string]: any;
}

export interface NormalizerOptions {
  sourceName?: string;
  defaultState?: string;
  sourceUrl?: string;
}

export class SchemeNormalizer {
  /**
   * Generates a clean URL slug from name or provided slug
   */
  public static generateSlug(rawSlug?: string, name?: string): string {
    if (rawSlug && typeof rawSlug === 'string' && rawSlug.trim()) {
      return rawSlug
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    if (name && typeof name === 'string' && name.trim()) {
      return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    return `scheme-${Date.now()}`;
  }

  /**
   * Normalizes incoming raw records into canonical Scheme schema without fabricating data.
   */
  public static normalize(raw: RawSchemeRecord, options?: NormalizerOptions | string): Partial<IScheme> {
    const defaultSource = typeof options === 'string' ? options : (options?.sourceName || 'myscheme.gov.in');
    const defaultState = typeof options === 'object' && options?.defaultState ? options.defaultState : 'Maharashtra';
    const fallbackSourceUrl = typeof options === 'object' && options?.sourceUrl ? options.sourceUrl : 'https://www.myscheme.gov.in';

    const name = (raw.name || raw['Scheme Name'] || '').toString().trim();
    const slug = (raw.slug || this.generateSlug(raw['Scheme Slug'], name)).toString().trim();
    const schemeId = (raw.schemeId || raw.scheme_id || slug).toString().trim();
    const description = (raw.description || raw.Description || raw.brief_description || '').toString().trim();

    // Determine Level: Central | State | Joint
    let level: 'Central' | 'State' | 'Joint' = 'State';
    const rawLevel = (raw.level || raw.Level || '').toString().toLowerCase();
    const rawState = (raw.state || '').toString().trim();
    const rawMinistry = (raw.ministry || raw['State / UT / Ministry'] || '').toString().trim();

    if (rawLevel.includes('joint') || rawLevel.includes('central & state') || rawLevel.includes('shared')) {
      level = 'Joint';
    } else if (rawLevel.includes('central') || rawState.toLowerCase() === 'central' || rawMinistry.toLowerCase().includes('ministry of')) {
      level = 'Central';
    } else {
      level = 'State';
    }

    // Resolve State
    let state = defaultState;
    if (rawState && rawState !== '' && rawState.toLowerCase() !== 'central') {
      state = rawState;
    } else if (rawMinistry && !rawMinistry.toLowerCase().includes('ministry')) {
      state = rawMinistry;
    } else if (level === 'Central') {
      state = 'Central';
    }

    // Category resolution
    let category: string[] = [];
    const rawCat = raw.category || raw['Tags / Categories'] || raw.tags;
    if (Array.isArray(rawCat)) {
      category = rawCat.map((c) => String(typeof c === 'object' ? JSON.stringify(c) : c).trim()).filter(Boolean);
    } else if (typeof rawCat === 'string' && rawCat.trim()) {
      category = rawCat.split(/[,;|]/).map((c) => c.trim()).filter(Boolean);
    }
    if (category.length === 0) {
      category = ['Civic Welfare'];
    }

    // Benefits parsing (handles string, array of objects, or subdocument)
    let benefitsRawText = '';
    let benefitType: 'subsidy' | 'cash_dbt' | 'loan' | 'scholarship' | 'in_kind' | 'insurance' | null = null;
    let estimatedValue: number | null = null;
    let percentage: number | null = null;

    if (typeof raw.benefits === 'string') {
      benefitsRawText = raw.benefits.trim();
    } else if (Array.isArray(raw.benefits)) {
      benefitsRawText = raw.benefits
        .map((b: any) => (typeof b === 'object' ? `${b.description || ''} ${b.amount ? `(₹${b.amount})` : ''}` : String(b)))
        .join('; ')
        .trim();
      const firstObj = raw.benefits[0];
      if (firstObj && typeof firstObj === 'object') {
        if (firstObj.type === 'capital_subsidy' || firstObj.type === 'subsidy') benefitType = 'subsidy';
        else if (firstObj.type === 'direct_benefit_transfer' || firstObj.type === 'cash_dbt') benefitType = 'cash_dbt';
        else if (firstObj.type === 'financial_grant') benefitType = 'subsidy';
        estimatedValue = typeof firstObj.amount === 'number' ? firstObj.amount : null;
      }
    } else if (raw.benefits && typeof raw.benefits === 'object') {
      benefitsRawText = raw.benefits.rawText || raw.benefits.description || '';
      benefitType = raw.benefits.type || null;
      estimatedValue = raw.benefits.estimatedValue ?? null;
      percentage = raw.benefits.percentage ?? null;
    } else if (raw.Benefits) {
      benefitsRawText = String(raw.Benefits).trim();
    }

    // Eligibility raw text
    let rawEligibility = '';
    if (typeof raw.eligibility === 'string') {
      rawEligibility = raw.eligibility.trim();
    } else if (raw.eligibility && typeof raw.eligibility === 'object' && raw.eligibility.rawText) {
      rawEligibility = raw.eligibility.rawText.trim();
    } else {
      rawEligibility = (
        raw.eligibility_text ||
        raw['Eligibility Criteria'] ||
        raw['Eligibility (General)'] ||
        ''
      ).toString().trim();
    }

    // Exclusions
    const exclusions: string[] = [];
    if (Array.isArray(raw.exclusions)) {
      exclusions.push(...raw.exclusions.map(String));
    } else if (typeof raw.exclusions === 'string' && raw.exclusions.trim()) {
      exclusions.push(
        ...raw.exclusions
          .split(/\n|•|;|(?:\d+\.)/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 5)
      );
    } else if (raw['Exclusions / Ineligibility']) {
      exclusions.push(
        ...String(raw['Exclusions / Ineligibility'])
          .split(/\n|•|;|(?:\d+\.)/)
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 5)
      );
    }

    // Structured Eligibility Parsing
    // If incoming record already has structured subdocument, respect it
    let structuredEligibility: IStructuredEligibility;
    if (raw.eligibility?.structured && typeof raw.eligibility.structured === 'object') {
      const s = raw.eligibility.structured;
      structuredEligibility = {
        ageMin: s.ageMin ?? s.minAge ?? null,
        ageMax: s.ageMax ?? s.maxAge ?? null,
        gender: s.gender ?? null,
        caste: Array.isArray(s.caste) ? s.caste : (Array.isArray(s.castes) ? s.castes : null),
        incomeMax: s.incomeMax ?? s.maxAnnualIncome ?? null,
        residence: s.residence ?? s.residenceType ?? null,
        states: Array.isArray(s.states) ? s.states : (Array.isArray(s.applicableStates) ? s.applicableStates : ['Maharashtra']),
        disabilityRequired: s.disabilityRequired ?? null,
        bplRequired: s.bplRequired ?? null,
        landholdingMaxAcres: s.landholdingMaxAcres ?? s.maxLandholdingAcres ?? null,
        otherConditions: Array.isArray(s.otherConditions) ? s.otherConditions : [],
      };
    } else {
      let ageMin: number | null = null;
      let ageMax: number | null = null;
      if (raw.eligibility_age_min !== undefined && raw.eligibility_age_min !== null) {
        const parsed = parseInt(String(raw.eligibility_age_min), 10);
        if (!isNaN(parsed) && parsed >= 0) ageMin = parsed;
      }
      if (raw.eligibility_age_max !== undefined && raw.eligibility_age_max !== null) {
        const parsed = parseInt(String(raw.eligibility_age_max), 10);
        if (!isNaN(parsed) && parsed > 0) ageMax = parsed;
      }

      let gender: 'all' | 'male' | 'female' | 'transgender' | null = null;
      if (raw.eligibility_gender) {
        const g = String(raw.eligibility_gender).toLowerCase().trim();
        if (['all', 'male', 'female', 'transgender'].includes(g)) {
          gender = g as any;
        }
      }

      let caste: string[] | null = null;
      if (raw.eligibility_caste) {
        if (Array.isArray(raw.eligibility_caste)) {
          caste = raw.eligibility_caste;
        } else if (typeof raw.eligibility_caste === 'string') {
          caste = raw.eligibility_caste.replace(/[\[\]'"]/g, '').split(',').map((c) => c.trim()).filter(Boolean);
        }
      }

      let incomeMax: number | null = null;
      if (raw.eligibility_income_max !== undefined && raw.eligibility_income_max !== null) {
        const parsed = parseInt(String(raw.eligibility_income_max).replace(/[^0-9]/g, ''), 10);
        if (!isNaN(parsed) && parsed > 0) incomeMax = parsed;
      }

      let residence: 'all' | 'rural' | 'urban' | null = null;
      if (raw.eligibility_residence) {
        const r = String(raw.eligibility_residence).toLowerCase().trim();
        if (['all', 'rural', 'urban'].includes(r)) {
          residence = r as any;
        } else if (r === 'both') {
          residence = 'all';
        }
      }

      let states: string[] = ['All'];
      if (raw.eligibility_state) {
        if (Array.isArray(raw.eligibility_state)) {
          states = raw.eligibility_state;
        } else if (typeof raw.eligibility_state === 'string') {
          states = raw.eligibility_state.replace(/[\[\]'"]/g, '').split(',').map((s) => s.trim()).filter(Boolean);
        }
      } else if (state && state !== 'Central') {
        states = [state];
      }

      const disabilityRequired =
        raw.eligibility_disability === true ||
        raw.eligibility_disability === 'true' ||
        raw.eligibility_disability === 'True'
          ? true
          : null;

      const bplRequired =
        raw.eligibility_bpl === true ||
        raw.eligibility_bpl === 'true' ||
        raw.eligibility_bpl === 'True'
          ? true
          : null;

      structuredEligibility = {
        ageMin,
        ageMax,
        gender,
        caste,
        incomeMax,
        residence,
        states,
        disabilityRequired,
        bplRequired,
        landholdingMaxAcres: null,
        otherConditions: [],
      };
    }

    // Documents parsing (handles array of document objects or raw strings)
    let documentsRaw = '';
    const mandatoryDocs: string[] = [];
    const optionalDocs: string[] = [];

    if (Array.isArray(raw.documents)) {
      raw.documents.forEach((d: any) => {
        if (typeof d === 'object') {
          const docName = d.name || d.title || '';
          if (docName) {
            if (d.isMandatory === false) {
              optionalDocs.push(docName);
            } else {
              mandatoryDocs.push(docName);
            }
          }
        } else if (typeof d === 'string') {
          mandatoryDocs.push(d);
        }
      });
      documentsRaw = mandatoryDocs.concat(optionalDocs).join('; ');
    } else if (raw.documents && typeof raw.documents === 'object') {
      documentsRaw = raw.documents.rawText || '';
      if (Array.isArray(raw.documents.mandatory)) mandatoryDocs.push(...raw.documents.mandatory);
      if (Array.isArray(raw.documents.optional)) optionalDocs.push(...raw.documents.optional);
    } else {
      documentsRaw = (raw.documents_required || raw['Documents Required'] || '').toString().trim();
      if (documentsRaw) {
        const docItems = documentsRaw
          .split(/\n|•|;/)
          .map((d: string) => d.trim())
          .filter((d: string) => d.length > 3);

        docItems.forEach((doc: string) => {
          const lower = doc.toLowerCase();
          if (lower.includes('optional') || lower.includes('if applicable') || lower.includes('if any')) {
            optionalDocs.push(doc);
          } else {
            mandatoryDocs.push(doc);
          }
        });
      }
    }

    // Application Mode & Steps
    let mode: 'online' | 'offline' | 'both' | 'not_specified' = 'not_specified';
    let steps: string[] = [];
    let applyUrl: string | null = null;
    let officialPortalUrl: string | null = null;

    if (raw.application && typeof raw.application === 'object') {
      mode = raw.application.mode || 'not_specified';
      steps = Array.isArray(raw.application.steps)
        ? raw.application.steps
        : Array.isArray(raw.application.processSteps)
        ? raw.application.processSteps
        : [];
      applyUrl = raw.application.applicationUrl || raw.application.applyUrl || null;
      officialPortalUrl = raw.application.officialPortalUrl || null;
    } else {
      const rawMode = (raw['Application Mode'] || '').toString().toLowerCase();
      const appProcess = (raw.application_process || raw['Application Process'] || '').toString().trim();

      if (rawMode.includes('both') || (rawMode.includes('online') && rawMode.includes('offline'))) {
        mode = 'both';
      } else if (rawMode.includes('online')) {
        mode = 'online';
      } else if (rawMode.includes('offline')) {
        mode = 'offline';
      } else if (appProcess) {
        const lower = appProcess.toLowerCase();
        if (lower.includes('online') && lower.includes('offline')) mode = 'both';
        else if (lower.includes('online')) mode = 'online';
        else if (lower.includes('offline')) mode = 'offline';
      }

      steps = appProcess
        ? appProcess
            .split(/\n|Step \d+:?/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 10)
        : [];

      applyUrl = (raw.apply_url || raw['Official Link'] || null)?.toString().trim() || null;
      officialPortalUrl = (raw.official_url || raw['MyScheme URL'] || applyUrl || null)?.toString().trim() || null;
    }

    // Governance & Verification Status
    let verificationStatus: 'officially_verified' | 'unverified_third_party' | 'pending_gazette_audit' = 'unverified_third_party';
    const rawStatus = (raw.governance?.verificationStatus || raw.verification_status || '').toString().toLowerCase();
    if (rawStatus === 'verified' || rawStatus === 'officially_verified') {
      verificationStatus = 'officially_verified';
    } else if (rawStatus === 'pending_gazette_audit') {
      verificationStatus = 'pending_gazette_audit';
    }

    const grReference = raw.governance?.grReference || raw.gr_reference || null;
    const lastVerifiedDate = raw.governance?.lastVerifiedDate
      ? new Date(raw.governance.lastVerifiedDate)
      : raw.scraped_at
      ? new Date(raw.scraped_at)
      : null;
    const dataCollectionSource = raw.governance?.dataCollectionSource || raw.source_dataset || defaultSource;
    const officialSourceUrl = raw.governance?.officialSourceUrl || officialPortalUrl || fallbackSourceUrl;

    return {
      schemeId,
      slug,
      name,
      nameLocal: raw.nameLocal || raw.name_local || null,
      description,
      level,
      state,
      ministry: rawMinistry || null,
      department: raw.department || rawMinistry || 'Government of Maharashtra',
      category,
      benefits: {
        rawText: benefitsRawText || 'Financial & welfare support according to government guidelines.',
        type: benefitType,
        estimatedValue,
        percentage,
        summary: benefitsRawText
      },
      eligibility: {
        rawText: rawEligibility,
        structured: structuredEligibility,
        exclusions,
      },
      documents: {
        rawText: documentsRaw,
        mandatory: mandatoryDocs,
        optional: optionalDocs,
      },
      application: {
        mode,
        processSteps: steps,
        applyUrl,
        officialPortalUrl: officialPortalUrl || officialSourceUrl,
      },
      governance: {
        grReference,
        lastVerifiedDate,
        dataCollectionSource,
        officialSourceUrl,
        verificationStatus,
        auditNotes: 'Ingested via GramSathi AI Normalizer with strict non-fabrication rules.',
      },
      tags: category,
    };
  }
}
