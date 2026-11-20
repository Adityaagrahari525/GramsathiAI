import mongoose from 'mongoose';
import type { Scheme as ISchemeType, SchemeFilters } from '../types/scheme.js';
import { Scheme as SchemeModel } from '../models/Scheme.js';
import {
  type ISchemeRepository,
  type CategoryItem,
  type DepartmentItem,
  StaticSchemeRepository,
} from './schemeRepository.js';
import { SECTORS_LIST } from '../data/schemes.js';

export class MongoSchemeRepository implements ISchemeRepository {
  private fallbackRepo: StaticSchemeRepository;

  constructor() {
    this.fallbackRepo = new StaticSchemeRepository();
  }

  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  private transformDoc(doc: any): ISchemeType {
    return {
      id: doc.id || doc.schemeId || String(doc._id),
      schemeNo: doc.schemeNo || doc.schemeId || '',
      name: doc.name || '',
      nameMr: doc.nameMr || doc.nameLocal || doc.name || '',
      nameHi: doc.nameHi || doc.name || '',
      sector: doc.sector || (Array.isArray(doc.category) && doc.category[0]?.toLowerCase()) || 'agriculture',
      sectorMr: doc.sectorMr || '',
      department: doc.department || '',
      departmentShort: doc.departmentShort || doc.department || '',
      level: doc.level || 'State',
      benefitAmount: doc.benefitAmount || (doc.benefits?.rawText ?? ''),
      benefitType: doc.benefitType || doc.benefits?.type || 'subsidy',
      accentColor: doc.accentColor || 'blue',
      headerBadges: doc.headerBadges || [],
      highlightTitle: doc.highlightTitle || '',
      highlightText: doc.highlightText || (doc.benefits?.summary ?? ''),
      highlightVariant: doc.highlightVariant || 'blue',
      targetBeneficiaryText: doc.targetBeneficiaryText || '',
      mandatoryDocs: doc.mandatoryDocs || doc.documents?.mandatory || [],
      bottomMeta: doc.bottomMeta || { text: 'Mode: Online' },
      summary: doc.summary || doc.description || '',
      description: doc.description || doc.summary || '',
      benefits: typeof doc.benefits === 'string' ? doc.benefits : (doc.benefits?.rawText ?? ''),
      eligibility: Array.isArray(doc.eligibility) ? doc.eligibility : [doc.eligibility?.rawText].filter(Boolean),
      documents: Array.isArray(doc.documents) ? doc.documents : (doc.documents?.mandatory || []),
      applicationSteps: doc.applicationSteps || doc.application?.processSteps || [],
      officialUrl: doc.officialUrl || doc.application?.officialPortalUrl || '',
      sourceUrl: doc.sourceUrl || doc.governance?.officialSourceUrl || '',
      tags: doc.tags || [],
      targetBeneficiaries: doc.targetBeneficiaries || [],
      verified: doc.verified ?? true,
      verificationStatus: doc.verificationStatus || 'demonstration',
      applicationMode: doc.applicationMode || 'Online',
      lastUpdated: doc.lastUpdated || 'Nov 2026',
      lastVerifiedDate: doc.lastVerifiedDate || '2026-11-15',
    };
  }

  async getAll(filters?: SchemeFilters): Promise<{ schemes: ISchemeType[]; total: number }> {
    if (!this.isDbConnected()) {
      return this.fallbackRepo.getAll(filters);
    }

    try {
      const query: Record<string, any> = {};

      if (filters?.sector && filters.sector !== 'all') {
        const sectorRegex = new RegExp(`^${filters.sector}$`, 'i');
        query.$or = [{ sector: sectorRegex }, { category: sectorRegex }];
      }

      if (filters?.level) {
        query.level = filters.level;
      }

      if (filters?.benefitType) {
        query.benefitType = filters.benefitType;
      }

      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.trim();
        const searchRegex = new RegExp(q, 'i');
        const textConditions = [
          { name: searchRegex },
          { nameMr: searchRegex },
          { nameHi: searchRegex },
          { summary: searchRegex },
          { description: searchRegex },
          { department: searchRegex },
          { tags: { $in: [searchRegex] } },
        ];

        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: textConditions }];
          delete query.$or;
        } else {
          query.$or = textConditions;
        }
      }

      const total = await SchemeModel.countDocuments(query);
      if (total === 0) {
        // If connected DB has 0 schemes (e.g. before seeding), safely fall back to static
        return this.fallbackRepo.getAll(filters);
      }

      const offset = filters?.offset ?? 0;
      const limit = filters?.limit && filters.limit > 0 ? filters.limit : 20;

      const docs = await SchemeModel.find(query)
        .skip(offset)
        .limit(limit)
        .lean()
        .exec();

      return {
        schemes: docs.map((doc) => this.transformDoc(doc)),
        total,
      };
    } catch (err) {
      console.warn('[MongoSchemeRepository] Database query error, falling back to static:', err);
      return this.fallbackRepo.getAll(filters);
    }
  }

  async getById(id: string): Promise<ISchemeType | null> {
    if (!this.isDbConnected()) {
      return this.fallbackRepo.getById(id);
    }

    try {
      const cleanId = id.trim();
      const doc = await SchemeModel.findOne({
        $or: [
          { id: cleanId },
          { schemeId: cleanId },
          { slug: cleanId.toLowerCase() },
          { schemeNo: cleanId },
        ],
      })
        .lean()
        .exec();

      if (!doc) {
        return this.fallbackRepo.getById(id);
      }

      return this.transformDoc(doc);
    } catch (err) {
      console.warn('[MongoSchemeRepository] Database find error, falling back to static:', err);
      return this.fallbackRepo.getById(id);
    }
  }

  async search(query: string, limit = 10): Promise<ISchemeType[]> {
    if (!this.isDbConnected()) {
      return this.fallbackRepo.search(query, limit);
    }

    try {
      if (!query || !query.trim()) {
        const docs = await SchemeModel.find({}).limit(limit).lean().exec();
        if (docs.length === 0) return this.fallbackRepo.search(query, limit);
        return docs.map((doc) => this.transformDoc(doc));
      }

      const searchRegex = new RegExp(query.trim(), 'i');
      const docs = await SchemeModel.find({
        $or: [
          { name: searchRegex },
          { nameMr: searchRegex },
          { nameHi: searchRegex },
          { summary: searchRegex },
          { department: searchRegex },
          { tags: { $in: [searchRegex] } },
        ],
      })
        .limit(limit)
        .lean()
        .exec();

      if (docs.length === 0) {
        return this.fallbackRepo.search(query, limit);
      }

      return docs.map((doc) => this.transformDoc(doc));
    } catch (err) {
      console.warn('[MongoSchemeRepository] Search error, falling back to static:', err);
      return this.fallbackRepo.search(query, limit);
    }
  }

  async getCategories(): Promise<CategoryItem[]> {
    if (!this.isDbConnected()) {
      return this.fallbackRepo.getCategories();
    }

    try {
      // Return predefined sectors list with verified icons & styling
      return SECTORS_LIST;
    } catch (err) {
      return this.fallbackRepo.getCategories();
    }
  }

  async getDepartments(): Promise<DepartmentItem[]> {
    if (!this.isDbConnected()) {
      return this.fallbackRepo.getDepartments();
    }

    try {
      const results = await SchemeModel.aggregate([
        {
          $group: {
            _id: '$department',
            departmentShort: { $first: '$departmentShort' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      if (!results || results.length === 0) {
        return this.fallbackRepo.getDepartments();
      }

      return results.map((r) => ({
        name: r._id,
        departmentShort: r.departmentShort || r._id,
        count: r.count,
      }));
    } catch (err) {
      return this.fallbackRepo.getDepartments();
    }
  }
}
