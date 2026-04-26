'use server';

import { reportService } from '@/services/admin/report.service';
import { ApiResponse } from '@/types/api.index';
import {
  IFraudReport,
  IGetFraudReportsParams,
  IGetSuspendedUsersParams,
  IReviewFraudReportInput,
  ISuspendedUserItem,
  ISuspensionTimelineItem,
} from '@/types/fraud-report.type';
import { cookies } from 'next/headers';

export const getFraudReportsAction = async (
  input: IGetFraudReportsParams
): Promise<
  ApiResponse<{
    reports: IFraudReport[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> => {
  const cookieStore = await cookies();
  return reportService.getReports(input, cookieStore.toString());
};

export const createFraudReportAction = async (input: {
  reportedUserId: string;
  targetedUserId: string;
  reportedUserType?: 'USER' | 'SELLER';
  category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
  level: 'LOW' | 'MEDIUM' | 'CRITICAL';
  reason: string;
}): Promise<ApiResponse<IFraudReport>> => {
  const cookieStore = await cookies();
  return reportService.createReport(input, cookieStore.toString());
};

export const updateFraudReportAction = async (
  reportId: string,
  input: {
    category?: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
    status?: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
    decision?: 'NO_ACTION' | 'FAULT_VERIFIED' | null;
    reporterType?: 'USER' | 'SELLER' | 'SYSTEM';
    source?: 'MANUAL' | 'SYSTEM';
    level?: 'LOW' | 'MEDIUM' | 'CRITICAL';
  }
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return reportService.updateReport(reportId, input, cookieStore.toString());
};

export const reviewFraudReportAction = async (
  reportId: string,
  input: IReviewFraudReportInput
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return reportService.reviewReport(reportId, input, cookieStore.toString());
};

export const markFraudReportUnderReviewAction = async (
  reportId: string
): Promise<ApiResponse<null>> => {
  const cookieStore = await cookies();
  return reportService.markUnderReview(reportId, cookieStore.toString());
};

export const getSuspendedUsersAction = async (
  input: IGetSuspendedUsersParams
): Promise<
  ApiResponse<{
    users: ISuspendedUserItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>
> => {
  const cookieStore = await cookies();
  return reportService.getSuspendedUsers(input, cookieStore.toString());
};

export const getSuspensionTimelineAction = async (
  userId: string
): Promise<ApiResponse<ISuspensionTimelineItem[]>> => {
  const cookieStore = await cookies();
  return reportService.getSuspensionTimeline(userId, cookieStore.toString());
};
