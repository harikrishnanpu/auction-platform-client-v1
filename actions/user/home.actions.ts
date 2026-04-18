'use server';

import { homeService } from '@/services/user/home.service';
import { ApiResponse } from '@/types/api.index';
import { IUserHomeStats } from '@/features/user/home/types/home.types';

export const getUserHomeStatsAction = async (): Promise<
  ApiResponse<IUserHomeStats>
> => {
  return homeService.getHomeStats();
};
