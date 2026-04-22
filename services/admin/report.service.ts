import { API_ENDPOINTS, buildApiUrl, buildQuery } from '@/apiInstance';
import { ApiResponse } from '@/types/api.index';
import {
  IFraudReport,
  FraudReportCategory,
  FraudReportLevel,
  FraudReportStatus,
  FraudReporterType,
  FraudAdminDecision,
  IGetFraudReportsParams,
  IGetSuspendedUsersParams,
  IReviewFraudReportInput,
  ISuspendedUserItem,
  ISuspensionTimelineItem,
} from '@/types/fraud-report.type';
import { getErrorMessage } from '@/utils/get-app-error';

export const reportService = {
  createReport: async (
    input: {
      reportedUserId: string;
      targetedUserId: string;
      reportedUserType?: 'USER' | 'SELLER';
      category: FraudReportCategory;
      level: FraudReportLevel;
      reason: string;
    },
    cookieString: string
  ): Promise<ApiResponse<IFraudReport>> => {
    try {
      const res = await fetch(buildApiUrl(API_ENDPOINTS.fraud.createReport), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookieString },
        credentials: 'include',
        body: JSON.stringify(input),
      });
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getReports: async (
    input: IGetFraudReportsParams,
    cookieString: string
  ): Promise<
    ApiResponse<{
      reports: IFraudReport[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > => {
    try {
      const query = buildQuery(input);
      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.fraud.getReports}?${query}`),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  reviewReport: async (
    reportId: string,
    input: IReviewFraudReportInput,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.fraud.reviewReport(reportId)),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify(input),
        }
      );
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: null };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  updateReport: async (
    reportId: string,
    input: {
      category?: FraudReportCategory;
      status?: FraudReportStatus;
      decision?: FraudAdminDecision | null;
      reporterType?: FraudReporterType;
      source?: 'MANUAL' | 'SYSTEM';
      level?: FraudReportLevel;
    },
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.fraud.getReports}/${reportId}`),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
          body: JSON.stringify(input),
        }
      );
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: null };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  markUnderReview: async (
    reportId: string,
    cookieString: string
  ): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.fraud.markUnderReview(reportId)),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: null };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getSuspendedUsers: async (
    input: IGetSuspendedUsersParams,
    cookieString: string
  ): Promise<
    ApiResponse<{
      users: ISuspendedUserItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > => {
    try {
      const query = buildQuery(input);
      const res = await fetch(
        buildApiUrl(`${API_ENDPOINTS.fraud.getSuspendedUsers}?${query}`),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },

  getSuspensionTimeline: async (
    userId: string,
    cookieString: string
  ): Promise<ApiResponse<ISuspensionTimelineItem[]>> => {
    try {
      const res = await fetch(
        buildApiUrl(API_ENDPOINTS.fraud.getSuspensionTimeline(userId)),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: cookieString },
          credentials: 'include',
        }
      );
      const response = await res.json();
      if (!res.ok) throw new Error(response.error ?? response.message);
      if (!response.success)
        throw new Error(response.error ?? response.message);
      return { success: true, data: response.data };
    } catch (err: unknown) {
      return { success: false, data: null, error: getErrorMessage(err) };
    }
  },
};
