export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error?: string;
}

export interface ApiResponseError extends Error {
  code?: string;
  statusCode?: number;
  message: string;
}
