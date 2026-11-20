import { IScheme } from '../models/Scheme.js';

export interface DuplicateMatch {
  matchType: 'EXACT_ID' | 'EXACT_SLUG' | 'NORMALIZED_TITLE' | 'PARTIAL_TITLE';
  confidence: number;
  existingId: string;
  incomingId: string;
  existingName: string;
  incomingName: string;
  resolution: 'KEPT_EXISTING' | 'UPGRADED_TO_VERIFIED' | 'UPDATED_EXISTING' | 'REJECTED_INCOMING';
}

export class SchemeDeduplicator {
  private existingSchemes: Map<string, Partial<IScheme>> = new Map();
  private slugIndex: Map<string, string> = new Map(); // slug -> schemeId
  private normalizedTitleIndex: Map<string, string> = new Map(); // normalizedTitle -> schemeId

  constructor(initialSchemes: Partial<IScheme>[] = []) {
    for (const scheme of initialSchemes) {
      this.register(scheme);
    }
  }

  public register(scheme: Partial<IScheme>): void {
    if (!scheme.schemeId) return;
    this.existingSchemes.set(scheme.schemeId, scheme);
    if (scheme.slug) {
      this.slugIndex.set(scheme.slug.toLowerCase().trim(), scheme.schemeId);
    }
    const cleanTitle = this.normalizeTitle(scheme.name || '');
    if (cleanTitle) {
      this.normalizedTitleIndex.set(cleanTitle, scheme.schemeId);
    }
  }

  /**
   * Cleans scheme title by lowercasing, removing punctuation, and stripping common generic stopwords & version numbers
   */
  public normalizeTitle(title: string): string {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[\(\)\[\]\{\}\-\–\—\:\,\.\/\\]/g, ' ')
      .replace(/\b(yojana|scheme|programme|initiative|mission|abhiyan|maharashtra|gov|govt|state|component|phase)\b/gi, '')
      .replace(/\b\d+(\s*\.\s*\d+)?\b/g, '') // remove version numbers like 2.0, 1.0, 2, etc.
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Checks if an incoming scheme is duplicate of any existing registered scheme
   */
  public findDuplicate(incoming: Partial<IScheme>): { isDuplicate: boolean; match?: DuplicateMatch; existing?: Partial<IScheme> } {
    if (!incoming.schemeId) return { isDuplicate: false };

    // 1. Check exact Scheme ID
    if (this.existingSchemes.has(incoming.schemeId)) {
      const existing = this.existingSchemes.get(incoming.schemeId)!;
      return {
        isDuplicate: true,
        existing,
        match: {
          matchType: 'EXACT_ID',
          confidence: 1.0,
          existingId: existing.schemeId || '',
          incomingId: incoming.schemeId || '',
          existingName: existing.name || '',
          incomingName: incoming.name || '',
          resolution: this.resolveConflict(existing, incoming)
        }
      };
    }

    // 2. Check exact slug
    if (incoming.slug && this.slugIndex.has(incoming.slug.toLowerCase().trim())) {
      const existingId = this.slugIndex.get(incoming.slug.toLowerCase().trim())!;
      const existing = this.existingSchemes.get(existingId)!;
      return {
        isDuplicate: true,
        existing,
        match: {
          matchType: 'EXACT_SLUG',
          confidence: 0.98,
          existingId: existing.schemeId || '',
          incomingId: incoming.schemeId || '',
          existingName: existing.name || '',
          incomingName: incoming.name || '',
          resolution: this.resolveConflict(existing, incoming)
        }
      };
    }

    // 3. Check normalized title match
    const incomingNormalized = this.normalizeTitle(incoming.name || '');
    if (incomingNormalized.length > 5 && this.normalizedTitleIndex.has(incomingNormalized)) {
      const existingId = this.normalizedTitleIndex.get(incomingNormalized)!;
      const existing = this.existingSchemes.get(existingId)!;
      return {
        isDuplicate: true,
        existing,
        match: {
          matchType: 'NORMALIZED_TITLE',
          confidence: 0.92,
          existingId: existing.schemeId || '',
          incomingId: incoming.schemeId || '',
          existingName: existing.name || '',
          incomingName: incoming.name || '',
          resolution: this.resolveConflict(existing, incoming)
        }
      };
    }

    return { isDuplicate: false };
  }

  /**
   * Safe merge strategy:
   * - If existing is 'verified' and incoming is 'unverified', keep verified.
   * - If existing is 'unverified' and incoming is 'verified', upgrade existing.
   * - If both are same status, keep the one with official GR reference or more complete fields.
   */
  private resolveConflict(existing: Partial<IScheme>, incoming: Partial<IScheme>): DuplicateMatch['resolution'] {
    const isExistingVerified = existing.governance?.verificationStatus === 'officially_verified';
    const isIncomingVerified = incoming.governance?.verificationStatus === 'officially_verified';

    if (isExistingVerified && !isIncomingVerified) {
      return 'KEPT_EXISTING';
    }

    if (!isExistingVerified && isIncomingVerified) {
      return 'UPGRADED_TO_VERIFIED';
    }

    if (incoming.governance?.grReference && !existing.governance?.grReference) {
      return 'UPDATED_EXISTING';
    }

    return 'KEPT_EXISTING';
  }

  /**
   * Safely merges incoming into existing if resolution permits
   */
  public merge(existing: Partial<IScheme>, incoming: Partial<IScheme>, resolution: DuplicateMatch['resolution']): Partial<IScheme> {
    if (resolution === 'KEPT_EXISTING') {
      return {
        ...existing,
        nameLocal: existing.nameLocal || incoming.nameLocal,
        documents: existing.documents || incoming.documents,
        application: {
          ...existing.application,
          applyUrl: existing.application?.applyUrl || incoming.application?.applyUrl || null,
          officialPortalUrl: existing.application?.officialPortalUrl || incoming.application?.officialPortalUrl || null,
          processSteps: existing.application?.processSteps?.length ? existing.application.processSteps : (incoming.application?.processSteps || []),
          mode: existing.application?.mode || incoming.application?.mode || 'not_specified'
        }
      };
    }

    if (resolution === 'UPGRADED_TO_VERIFIED' || resolution === 'UPDATED_EXISTING') {
      return {
        ...incoming,
        nameLocal: incoming.nameLocal || existing.nameLocal
      };
    }

    return existing;
  }
}
