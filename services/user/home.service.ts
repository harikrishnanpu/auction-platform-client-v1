import { cookies } from 'next/headers';

import { API_ENDPOINTS, buildApiUrl } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ApiResponse } from '@/types/api.index';
import { IUserHomeStats } from '@/features/user/home/types/home.types';

export const homeService = {
  getHomeStats: async (): Promise<ApiResponse<IUserHomeStats>> => {
    const cookieStorage = await cookies();
    return apiFetch<IUserHomeStats>(
      buildApiUrl(API_ENDPOINTS.user.homeStats),
      { method: 'GET' },
      cookieStorage
    );
  },
};
