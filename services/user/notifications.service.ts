import { cookies } from 'next/headers';

import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { apiFetch } from '@/lib/fetch';
import { ApiResponse } from '@/types/api.index';
import type { IUserNotificationsPage } from '@/features/user/notifications/types/notifications.types';

export const notificationsService = {
  list: async (params: {
    page: number;
    limit: number;
  }): Promise<ApiResponse<IUserNotificationsPage>> => {
    const cookieStorage = await cookies();
    const query = buildQuery(params);

    return apiFetch<IUserNotificationsPage>(
      `${buildApiUrl(API_ENDPOINTS.user.notifications)}?${query}`,
      { method: 'GET' },
      cookieStorage
    );
  },
};
