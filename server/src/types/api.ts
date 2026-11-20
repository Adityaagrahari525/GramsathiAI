export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    total?: number;
    count?: number;
    page?: number;
    limit?: number;
    [key: string]: unknown;
  };
}
