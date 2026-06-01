'use server';

import { notificationsService } from '@/services/user/notifications.service';
import { ApiResponse } from '@/types/api.index';
import type { IUserNotificationsPage } from '@/features/user/notifications/types/notifications.types';

export async function getUserNotificationsAction(params: {
  page: number;
  limit: number;
}): Promise<ApiResponse<IUserNotificationsPage>> {
  return notificationsService.list(params);
}
