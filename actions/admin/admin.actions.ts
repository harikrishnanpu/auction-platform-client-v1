'use server';

import { adminService, SellerInfo } from '@/services/admin/admin.service';
import { IgetllSellersParams, IgetllUsersParams } from '@/types/admin.type';
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

export const getAllSellersAction = async (
  input: IgetllSellersParams
): Promise<
  ApiResponse<{
    sellers: SellerInfo[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> => {
  const cookieStore = await cookies();
  return adminService.getAllSellers(input, cookieStore.toString());
};

export const getAdminSellerAction = async (
  id: string
): Promise<ApiResponse<SellerInfo>> => {
  const cookieStore = await cookies();
  return adminService.getAdminSeller(cookieStore.toString(), id);
};

export const approveSellerKycAction = async (
  sellerId: string
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return adminService.approveSellerKyc(sellerId, cookieStore.toString());
};

export const rejectSellerKycAction = async (
  sellerId: string,
  reason: string
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return adminService.rejectSellerKyc(sellerId, reason, cookieStore.toString());
};
