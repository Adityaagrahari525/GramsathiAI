import { schemeRepository, type CategoryItem, type DepartmentItem } from '../repositories/schemeRepository.js';
import type { Scheme, SchemeFilters } from '../types/scheme.js';

export class SchemeService {
  static async getSchemes(filters?: SchemeFilters): Promise<{ schemes: Scheme[]; total: number }> {
    return schemeRepository.getAll(filters);
  }

  static async getSchemeById(id: string): Promise<Scheme | null> {
    return schemeRepository.getById(id);
  }

  static async getCategories(): Promise<CategoryItem[]> {
    return schemeRepository.getCategories();
  }

  static async getDepartments(): Promise<DepartmentItem[]> {
    return schemeRepository.getDepartments();
  }

  static async searchSchemes(query: string, limit = 10): Promise<Scheme[]> {
    return schemeRepository.search(query, limit);
  }
}
