export type FraudReportCategory =
  | 'AUCTION_FRAUD_CRITICAL'
  | 'PAYMENT_CRITICAL'
  | 'OTHER';
export type FraudReportLevel = 'LOW' | 'MEDIUM' | 'CRITICAL';
export type FraudReportStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED';
export type FraudAdminDecision = 'NO_ACTION' | 'FAULT_VERIFIED';
export type FraudReporterType = 'USER' | 'SELLER' | 'SYSTEM';
export type SuspensionType = 'TEMPORARY' | 'PERMANENT';

export interface IFraudReport {
  id: string;
  reportedUserId: string;
  reportedUserName?: string | null;
  targetedUserId: string;
  targetedUserName?: string | null;
  reporterType: FraudReporterType;
  source: 'MANUAL' | 'SYSTEM';
  category: FraudReportCategory;
  level: FraudReportLevel;
  reason: string;
  status: FraudReportStatus;
  adminDecision: FraudAdminDecision | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface IGetFraudReportsParams {
  page: number;
  limit: number;
  search: string;
  status?: FraudReportStatus;
  sort?: 'createdAt' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface IReviewFraudReportInput {
  decision: FraudAdminDecision;
  note?: string;
}

export interface ISuspendedUserItem {
  userId: string;
  userName: string;
  email: string;
  status: string;
  activeSuspensionType: SuspensionType;
  activeSuspensionEndsAt: string | null;
}

export interface IGetSuspendedUsersParams {
  page: number;
  limit: number;
  search: string;
}

export interface ISuspensionTimelineItem {
  id: string;
  userId: string;
  reportId: string | null;
  type: SuspensionType;
  reason: string;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
}
