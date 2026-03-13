'use server';

import { adminService } from '@/services/admin/admin.service';
import { IgetllUsersParams } from '@/types/admin.type';
import { ApiResponse } from '@/types/api.index';
import { UserInfo } from '@/types/user.type';
import { cookies } from 'next/headers';

export const getAllUsersAction = async (
  input: IgetllUsersParams
): Promise<
  ApiResponse<{
    users: UserInfo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    currentPage: number;
  }>
> => {
  const cookieStore = await cookies();

  return adminService.getAllUsers(input, cookieStore.toString());
};

export const blockUserAction = async (
  id: string,
  block: boolean
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();

  return adminService.blockUser(id, block, cookieStore.toString());
};

export const getAdminUserAction = async (
  id: string
): Promise<ApiResponse<UserInfo>> => {
  const cookieStore = await cookies();

  return adminService.getAdminUser(cookieStore.toString(), id);
};
