import type { Scheme } from '../data/schemesData';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    total?: number;
    count?: number;
    [key: string]: any;
  };
}

export interface BackendHealth {
  status: string;
  uptimeSeconds: number;
  environment: string;
  version: string;
  database: {
    mode: string;
    recordsLoaded: number;
    mongoDbConfigured: boolean;
  };
  timestamp: string;
}

export interface CategoryData {
  id: string;
  title: string;
  titleMr: string;
  schemesCount: number;
  highlights: string;
  color: string;
}

export interface DepartmentData {
  name: string;
  departmentShort: string;
  count: number;
}

export interface EvaluatedSchemeApiResult {
  scheme: Scheme;
  verdict: 'potentially_eligible' | 'does_not_match' | 'more_info_required';
  score: number;
  matchedCriteria: string[];
  missingCriteria: string[];
  recommendationReason: string;
  estimatedBenefit: string;
}

export interface EligibilityApiResponse {
  timestamp: string;
  profileEvaluated: any;
  totalEvaluated: number;
  eligibleCount: number;
  actionRequiredCount: number;
  ineligibleCount: number;
  topMatches: EvaluatedSchemeApiResult[];
  actionRequiredMatches: EvaluatedSchemeApiResult[];
}

export interface RecommendApiResult {
  scheme: Scheme;
  matchScore: number;
  matchedReason: string;
  relevantEligibility: string;
  detailUrl: string;
  matchedKeywords: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  district?: string | null;
  taluka?: string | null;
  village?: string | null;
  preferredLanguage?: 'mr' | 'hi' | 'en';
  role?: string;
  gender?: string | null;
  occupation?: string | null;
  landholdingAcres?: number | null;
  socialCategory?: string | null;
  createdAt?: string;
}

export interface AuthResponseData {
  user: AuthUser;
  token: string;
}

// Configurable base URL
const BASE_URL =
  (import.meta.env?.VITE_API_URL as string) || 'http://localhost:5000/api';

const TOKEN_KEY = 'gramsathi_auth_token';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    if (typeof window !== 'undefined') {
      try {
        this.token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      } catch {
        this.token = null;
      }
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getToken(): string | null {
    return this.token;
  }

  public setToken(token: string | null, remember = true): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      try {
        if (token) {
          if (remember) {
            localStorage.setItem(TOKEN_KEY, token);
          } else {
            sessionStorage.setItem(TOKEN_KEY, token);
          }
        } else {
          localStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(TOKEN_KEY);
        }
      } catch (err) {
        console.warn('[ApiClient] Failed to store auth token:', err);
      }
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin',
      });

      const json: ApiResponse<T> = await response.json().catch(() => ({
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: `Non-JSON response received from ${url} (HTTP ${response.status})`,
        },
      }));

      if (!response.ok && json.success !== false) {
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: json.error?.message || `HTTP error ${response.status}: ${response.statusText}`,
          },
        };
      }

      return json;
    } catch (err: any) {
      console.warn(`[ApiClient] Network request failed for ${url}:`, err.message);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message:
            err.name === 'AbortError'
              ? 'Request timeout'
              : 'Backend service unreachable. Please ensure GramSathi API server is running on port 5000.',
          details: err.message,
        },
      };
    }
  }

  // ----------------------------------------------------------------------
  // Health Check
  // ----------------------------------------------------------------------
  async getHealth(): Promise<ApiResponse<BackendHealth>> {
    return this.request<BackendHealth>('health');
  }

  // ----------------------------------------------------------------------
  // Authentication Endpoints
  // ----------------------------------------------------------------------
  async register(data: {
    name: string;
    email?: string;
    phone: string;
    password?: string;
    preferredLanguage?: string;
    district?: string;
  }): Promise<ApiResponse<AuthResponseData>> {
    const res = await this.request<AuthResponseData>('auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async login(data: {
    identifier: string;
    password?: string;
    otp?: string;
    rememberDevice?: boolean;
  }): Promise<ApiResponse<AuthResponseData>> {
    const res = await this.request<AuthResponseData>('auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.success && res.data?.token) {
      this.setToken(res.data.token, data.rememberDevice ?? true);
    }
    return res;
  }

  async getMe(): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request<{ user: AuthUser }>('auth/me');
  }

  async logout(): Promise<ApiResponse<{ message: string }>> {
    try {
      const res = await this.request<{ message: string }>('auth/logout', {
        method: 'POST',
      });
      this.setToken(null);
      return res;
    } catch {
      this.setToken(null);
      return { success: true, data: { message: 'Logged out locally' } };
    }
  }

  // ----------------------------------------------------------------------
  // User Profile & Persistence Endpoints
  // ----------------------------------------------------------------------
  async getProfile(): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request<{ user: AuthUser }>('user/profile');
  }

  async updateProfile(updates: Partial<AuthUser>): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request<{ user: AuthUser }>('user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getSavedSchemes(): Promise<ApiResponse<{ savedSchemes: string[] }>> {
    return this.request<{ savedSchemes: string[] }>('user/saved-schemes');
  }

  async saveScheme(schemeId: string): Promise<ApiResponse<{ savedSchemes: string[] }>> {
    return this.request<{ savedSchemes: string[] }>('user/saved-schemes', {
      method: 'POST',
      body: JSON.stringify({ schemeId }),
    });
  }

  async removeSavedScheme(schemeId: string): Promise<ApiResponse<{ savedSchemes: string[] }>> {
    return this.request<{ savedSchemes: string[] }>(
      `user/saved-schemes/${encodeURIComponent(schemeId)}`,
      { method: 'DELETE' }
    );
  }

  async getJourney(schemeId: string): Promise<ApiResponse<{ journey: any }>> {
    return this.request<{ journey: any }>(`user/journey/${encodeURIComponent(schemeId)}`);
  }

  async updateJourney(
    schemeId: string,
    journeyData: { currentStage?: string; completedStages?: string[]; status?: string }
  ): Promise<ApiResponse<{ journey: any }>> {
    return this.request<{ journey: any }>(`user/journey/${encodeURIComponent(schemeId)}`, {
      method: 'PUT',
      body: JSON.stringify(journeyData),
    });
  }

  // ----------------------------------------------------------------------
  // Scheme Exploration & Discovery
  // ----------------------------------------------------------------------
  async getSchemes(params?: {
    sector?: string;
    level?: string;
    benefitType?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Scheme[]>> {
    const query = new URLSearchParams();
    if (params?.sector) query.set('sector', params.sector);
    if (params?.level) query.set('level', params.level);
    if (params?.benefitType) query.set('benefitType', params.benefitType);
    if (params?.search) query.set('search', params.search);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString();
    return this.request<Scheme[]>(`schemes${qs ? `?${qs}` : ''}`);
  }

  async getSchemeById(id: string): Promise<ApiResponse<Scheme>> {
    return this.request<Scheme>(`schemes/${encodeURIComponent(id)}`);
  }

  async getCategories(): Promise<ApiResponse<CategoryData[]>> {
    return this.request<CategoryData[]>('schemes/categories');
  }

  async getDepartments(): Promise<ApiResponse<DepartmentData[]>> {
    return this.request<DepartmentData[]>('schemes/departments');
  }

  async searchSchemes(query: string, limit = 10): Promise<ApiResponse<Scheme[]>> {
    return this.request<Scheme[]>(
      `schemes/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  }

  async checkEligibility(profile: any): Promise<ApiResponse<EligibilityApiResponse>> {
    return this.request<EligibilityApiResponse>('eligibility/check', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  async recommendSchemes(
    query: string,
    options?: { eligibleOnly?: boolean; userHolding?: number; category?: string }
  ): Promise<ApiResponse<RecommendApiResult[]>> {
    return this.request<RecommendApiResult[]>('discovery/recommend', {
      method: 'POST',
      body: JSON.stringify({ query, options }),
    });
  }

  // ----------------------------------------------------------------------
  // Gemini AI Assistant Endpoints
  // ----------------------------------------------------------------------
  async getAssistantStatus(): Promise<ApiResponse<{
    service: string;
    isConfigured: boolean;
    mode: 'gemini_grounded' | 'deterministic_fallback';
    statusNotice: string;
    supportedLanguages: string[];
  }>> {
    return this.request('assistant/status');
  }

  async assistantChat(data: {
    message: string;
    language?: 'en' | 'mr' | 'hi';
    conversationHistory?: Array<{ sender: 'user' | 'assistant'; content: string }>;
  }): Promise<ApiResponse<{
    reply: string;
    source: 'gemini_grounded' | 'deterministic_fallback';
    isConfigured: boolean;
    sources: string[];
    matchedSchemes: Array<{
      id: string;
      name: string;
      nameMr?: string;
      department?: string;
      officialUrl: string;
      benefitAmount: string;
    }>;
  }>> {
    return this.request('assistant/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(BASE_URL);
