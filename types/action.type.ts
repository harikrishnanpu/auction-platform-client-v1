import { ApiResponse } from './api.index';

export type ActionType<T> = {
  data: ApiResponse<T>;
  error: string;
  message?: string;
};
