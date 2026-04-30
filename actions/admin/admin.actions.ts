'use server';

import { adminService, SellerInfo } from '@/services/admin/admin.service';
import { IAdminDashboardStats } from '@/types/admin-dashboard.type';
import { IgetllSellersParams, IgetllUsersParams } from '@/types/admin.type';
import { ApiResponse } from '@/types/api.index';
import { IUser } from '@/types/user.type';
import { ISystemConfig } from '@/types/system-config.type';
import {
  IAllowedSubscriptionFeatureMetadata,
  ISubscribedUser,
  ISubscriptionPlan,
} from '@/types/subscription.type';
import { cookies } from 'next/headers';

export const getAllUsersAction = async (
  input: IgetllUsersParams
): Promise<
  ApiResponse<{
    users: IUser[];
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

export const getAdminDashboardStatsAction = async (): Promise<
  ApiResponse<IAdminDashboardStats>
> => {
  const cookieStore = await cookies();
  return adminService.getDashboardStats(cookieStore.toString());
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
): Promise<ApiResponse<IUser>> => {
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

export const getSystemConfigsAction = async (): Promise<
  ApiResponse<{ configs: ISystemConfig[] }>
> => {
  const cookieStore = await cookies();
  return adminService.getSystemConfigs(cookieStore.toString());
};

export const updateSystemConfigAction = async (input: {
  key: string;
  value: string;
  description?: string | null;
}): Promise<ApiResponse<ISystemConfig>> => {
  const cookieStore = await cookies();
  return adminService.updateSystemConfig(input, cookieStore.toString());
};

export const createSubscriptionPlanAction = async (input: {
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isDefault: boolean;
  features: {
    featureId: string;
    value: string;
  }[];
}): Promise<ApiResponse<ISubscriptionPlan>> => {
  const cookieStore = await cookies();
  return adminService.createSubscriptionPlan(input, cookieStore.toString());
};

export const updateSubscriptionPlanAction = async (input: {
  planId: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  isDefault: boolean;
  isActive: boolean;
  features: {
    featureId: string;
    value: string;
  }[];
}): Promise<ApiResponse<ISubscriptionPlan>> => {
  const cookieStore = await cookies();
  return adminService.updateSubscriptionPlan(input, cookieStore.toString());
};

export const getSubscribedUsersAction = async (): Promise<
  ApiResponse<{ subscriptions: ISubscribedUser[] }>
> => {
  const cookieStore = await cookies();
  return adminService.getSubscribedUsers(cookieStore.toString());
};

export const getSubscriptionFeatureMetadataAction = async (): Promise<
  ApiResponse<{ features: IAllowedSubscriptionFeatureMetadata[] }>
> => {
  const cookieStore = await cookies();
  return adminService.getSubscriptionFeatureMetadata(cookieStore.toString());
};

export const getSubscriptionPlansAction = async (): Promise<
  ApiResponse<{ plans: ISubscriptionPlan[] }>
> => {
  const cookieStore = await cookies();
  return adminService.getSubscriptionPlans(cookieStore.toString());
};
