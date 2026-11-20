import AsyncStorage from '@react-native-async-storage/async-storage';
import { Scheme } from '../data/schemesData';

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

import { Platform } from 'react-native';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';
const TOKEN_KEY = 'gramsathi_mobile_auth_token';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.loadToken();
  }

  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      this.token = null;
    }
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getToken(): string | null {
    return this.token;
  }

  public async setToken(token: string | null): Promise<void> {
    this.token = token;
    try {
      if (token) {
        await AsyncStorage.setItem(TOKEN_KEY, token);
      } else {
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
    } catch (err) {
      console.warn('[ApiClient] Failed to store auth token:', err);
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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: `HTTP_${response.status}`,
            message: data.message || `Request failed with status ${response.status}`,
          },
        };
      }

      return data;
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
          message: err.message || 'Network request failed',
        },
      };
    }
  }

  // Auth Endpoints
  async register(userData: any): Promise<ApiResponse<AuthResponseData>> {
    return this.request<AuthResponseData>('auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { phone: string; password?: string }): Promise<ApiResponse<AuthResponseData>> {
    return this.request<AuthResponseData>('auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe(): Promise<ApiResponse<{ user: AuthUser }>> {
    return this.request<{ user: AuthUser }>('auth/me');
  }

  // Scheme Endpoints
  async getSchemes(params?: { sector?: string; search?: string }): Promise<ApiResponse<Scheme[]>> {
    const query = new URLSearchParams();
    if (params?.sector) query.append('sector', params.sector);
    if (params?.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<Scheme[]>(`schemes${queryString}`);
  }

  async getSchemeById(id: string): Promise<ApiResponse<Scheme>> {
    return this.request<Scheme>(`schemes/${id}`);
  }

  // Eligibility Evaluation
  async evaluateEligibility(profile: any): Promise<ApiResponse<EligibilityApiResponse>> {
    return this.request<EligibilityApiResponse>('eligibility/evaluate', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
  }

  // AI Assistant Endpoints
  async askAssistant(message: string, lang: string = 'mr', history: any[] = []): Promise<ApiResponse<any>> {
    return this.request('assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message, lang, history }),
    });
  }

  // Fraud / Scam Check
  async checkFraud(text: string, lang: string = 'mr'): Promise<ApiResponse<any>> {
    return this.request('assistant/fraud-check', {
      method: 'POST',
      body: JSON.stringify({ message: text, lang }),
    });
  }

  // Saved Schemes Endpoints (Shared with website)
  async getSavedSchemes(): Promise<ApiResponse<{ schemes: any[] }>> {
    return this.request<{ schemes: any[] }>('user/saved-schemes');
  }

  async saveScheme(schemeId: string, notes?: string): Promise<ApiResponse<any>> {
    return this.request('user/saved-schemes', {
      method: 'POST',
      body: JSON.stringify({ schemeId, notes }),
    });
  }

  async removeSavedScheme(schemeId: string): Promise<ApiResponse<any>> {
    return this.request(`user/saved-schemes/${schemeId}`, {
      method: 'DELETE',
    });
  }

  // Scheme Journey Endpoints (Shared with website)
  async getJourney(schemeId: string): Promise<ApiResponse<any>> {
    return this.request(`user/journey/${schemeId}`);
  }

  async updateJourney(
    schemeId: string,
    data: { currentStage: string; notes?: string; documentsGathered?: string[] }
  ): Promise<ApiResponse<any>> {
    return this.request(`user/journey/${schemeId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // User Profile
  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.request('user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Reverse Discovery
  async findByNeed(needText: string, lang: string = 'mr'): Promise<ApiResponse<any>> {
    return this.request('discovery/need', {
      method: 'POST',
      body: JSON.stringify({ query: needText, lang }),
    });
  }
}

export const apiClient = new ApiClient(BASE_URL);
export default apiClient;
