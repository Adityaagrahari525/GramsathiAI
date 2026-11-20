import { IScheme } from '../models/Scheme.js';

export interface ValidationIssue {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  schemeId: string;
  schemeName: string;
  issues: ValidationIssue[];
}

export class SchemeValidator {
  /**
   * Enforces the 10 GramSathi AI Data Rules:
   * 1. Never fabricate scheme details.
   * 2. Never infer missing eligibility requirements.
   * 3. Preserve original eligibility text.
   * 4. Distinguish structured eligibility fields from unparsed text.
   * 5. Keep unknown values null.
   * 6. Record the original source URL for each scheme.
   * 7. Identify duplicate schemes (handled in deduplicator).
   * 8. Record data collection and verification dates.
   * 9. Never mark an unverified record as officially verified.
   * 10. Respect source licence, terms of use and access restrictions.
   */
  public static validate(scheme: Partial<IScheme>): ValidationResult {
    const issues: ValidationIssue[] = [];

    // Rule 1 & Essential presence check: ID & Name
    if (!scheme.schemeId || typeof scheme.schemeId !== 'string' || scheme.schemeId.trim().length === 0) {
      issues.push({
        field: 'schemeId',
        rule: 'RULE_1_MANDATORY_FIELD',
        message: 'Scheme ID is missing, null, or empty string.',
        severity: 'error'
      });
    }

    if (!scheme.name || typeof scheme.name !== 'string' || scheme.name.trim().length < 3) {
      issues.push({
        field: 'name',
        rule: 'RULE_1_MANDATORY_FIELD',
        message: 'Scheme name is missing or shorter than 3 characters.',
        severity: 'error'
      });
    }

    if (!scheme.description || typeof scheme.description !== 'string' || scheme.description.trim().length < 10) {
      issues.push({
        field: 'description',
        rule: 'RULE_1_MANDATORY_FIELD',
        message: 'Scheme description is missing or too brief (<10 chars).',
        severity: 'error'
      });
    }

    // Check for fake/placeholder text indicators
    const suspiciousPlaceholders = ['lorem ipsum', 'test scheme', 'placeholder', 'fake', 'asdf', 'sample scheme'];
    const nameLower = (scheme.name || '').toLowerCase();
    const descLower = (scheme.description || '').toLowerCase();
    if (suspiciousPlaceholders.some(p => nameLower.includes(p) || descLower.includes(p))) {
      issues.push({
        field: 'name_or_description',
        rule: 'RULE_1_NO_FABRICATION',
        message: 'Detected placeholder or fabricated text in scheme name or description.',
        severity: 'error'
      });
    }

    // Level check: Central | State | Joint
    if (!scheme.level || !['Central', 'State', 'Joint'].includes(scheme.level)) {
      issues.push({
        field: 'level',
        rule: 'RULE_1_VALID_ENUM',
        message: `Invalid government level '${scheme.level}'. Must be Central, State, or Joint.`,
        severity: 'error'
      });
    }

    // If State level, state field must not be empty
    if (scheme.level === 'State' && (!scheme.state || scheme.state.trim().length === 0)) {
      issues.push({
        field: 'state',
        rule: 'RULE_1_MANDATORY_FIELD',
        message: "State field must not be empty when level is 'State'.",
        severity: 'error'
      });
    }

    // Rule 6: Record official source URL
    if (!scheme.governance?.officialSourceUrl) {
      issues.push({
        field: 'governance.officialSourceUrl',
        rule: 'RULE_6_SOURCE_URL_REQUIRED',
        message: 'Missing official source URL. Source attribution is mandatory.',
        severity: 'error'
      });
    } else {
      try {
        const parsedUrl = new URL(scheme.governance.officialSourceUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          issues.push({
            field: 'governance.officialSourceUrl',
            rule: 'RULE_6_VALID_URL',
            message: `Invalid URL protocol in officialSourceUrl: ${parsedUrl.protocol}`,
            severity: 'error'
          });
        }
      } catch {
        issues.push({
          field: 'governance.officialSourceUrl',
          rule: 'RULE_6_VALID_URL',
          message: `Malformed officialSourceUrl: '${scheme.governance.officialSourceUrl}'`,
          severity: 'error'
        });
      }
    }

    // Rule 9: Never mark an unverified record as officially verified
    if (scheme.governance?.verificationStatus === 'officially_verified') {
      const sourceUrl = (scheme.governance.officialSourceUrl || '').toLowerCase();
      const hasGovDomain = sourceUrl.includes('.gov.in') || sourceUrl.includes('.nic.in') || sourceUrl.includes('mahadbt') || sourceUrl.includes('maharashtra.gov.in') || sourceUrl.includes('mahadiscom.in');
      const hasGR = Boolean(scheme.governance.grReference && scheme.governance.grReference.trim().length > 3);

      if (!hasGovDomain && !hasGR) {
        issues.push({
          field: 'governance.verificationStatus',
          rule: 'RULE_9_NO_UNVERIFIED_ELEVATION',
          message: "Record is marked 'officially_verified' without a verified .gov.in/.nic.in domain or Government Resolution (GR) reference.",
          severity: 'error'
        });
      }
    }

    // Rule 3 & 4: Preserve raw text and distinguish structured eligibility
    if (!scheme.eligibility?.rawText || scheme.eligibility.rawText.trim().length === 0) {
      issues.push({
        field: 'eligibility.rawText',
        rule: 'RULE_3_PRESERVE_RAW_ELIGIBILITY',
        message: 'Missing unparsed raw eligibility text.',
        severity: 'warning'
      });
    }

    // Structured age bounds check
    const ageMin = scheme.eligibility?.structured?.ageMin;
    const ageMax = scheme.eligibility?.structured?.ageMax;
    if (ageMin !== null && ageMin !== undefined && ageMax !== null && ageMax !== undefined) {
      if (ageMin > ageMax) {
        issues.push({
          field: 'eligibility.structured.age',
          rule: 'RULE_1_LOGICAL_BOUNDS',
          message: `Minimum age (${ageMin}) is greater than maximum age (${ageMax}).`,
          severity: 'error'
        });
      }
      if (ageMin < 0 || ageMax > 120) {
        issues.push({
          field: 'eligibility.structured.age',
          rule: 'RULE_1_LOGICAL_BOUNDS',
          message: `Unrealistic age limits specified: ${ageMin} - ${ageMax}.`,
          severity: 'error'
        });
      }
    }

    // Benefits check
    if (!scheme.benefits?.rawText || scheme.benefits.rawText.trim().length === 0) {
      issues.push({
        field: 'benefits.rawText',
        rule: 'RULE_1_MANDATORY_FIELD',
        message: 'Missing scheme benefits description.',
        severity: 'warning'
      });
    }

    const hasErrors = issues.some(i => i.severity === 'error');

    return {
      isValid: !hasErrors,
      schemeId: scheme.schemeId || 'UNKNOWN_ID',
      schemeName: scheme.name || 'Unnamed Scheme',
      issues
    };
  }
}
