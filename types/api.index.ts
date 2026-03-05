export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code: string;
}

export interface ApiError {
  success: boolean;
  code: string;
  message: string;
}
