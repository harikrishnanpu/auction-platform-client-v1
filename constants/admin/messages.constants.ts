export const ADMIN_USER_MESSAGES = {
  BLOCKED: 'User blocked successfully',
  UNBLOCKED: 'User unblocked successfully',
  BLOCKED_SHORT: 'User blocked.',
  UNBLOCKED_SHORT: 'User unblocked.',
  UPDATE_FAILED: 'Failed to update user',
  STATUS_UPDATE_FAILED: 'Failed to update user status.',
  SUSPENDED_LOAD_FAILED: 'Failed to load suspended users',
  TIMELINE_FETCH_FAILED: 'Failed to fetch timeline',
} as const;

export const ADMIN_SELLER_MESSAGES = {
  BLOCKED: 'Seller blocked.',
  UNBLOCKED: 'Seller unblocked.',
  STATUS_UPDATE_FAILED: 'Failed to update seller status.',
  KYC_APPROVED: 'KYC approved.',
  KYC_APPROVE_FAILED: 'Failed to approve KYC.',
  KYC_REJECTED: 'KYC rejected.',
  KYC_REJECT_FAILED: 'Failed to reject KYC.',
  REJECTION_REASON_REQUIRED: 'Please provide a rejection reason.',
} as const;

export const ADMIN_CATEGORY_MESSAGES = {
  NAME_REQUIRED: 'Category name is required',
  UPDATE_FAILED: 'Failed to update category',
  STATUS_UPDATE_FAILED: 'Failed to update category status',
  statusUpdated: (status: string) => `Category status updated to ${status}`,
  APPROVE_FAILED: 'Failed to approve request',
  APPROVED: 'Request approved successfully',
  REJECT_REASON_REQUIRED: 'Reject reason is required',
  REJECT_FAILED: 'Failed to reject request',
  REJECTED: 'Request rejected',
} as const;

export const ADMIN_SUBSCRIPTION_MESSAGES = {
  FEATURE_REQUIRED: 'Add at least one feature with a value',
  PLAN_FIELDS_REQUIRED: 'Plan name and description are required',
  PLAN_NUMBERS_INVALID: 'Plan amount and duration must be valid numbers',
  CREATE_FAILED: 'Failed to create plan',
  CREATED: 'Subscription plan created',
  UPDATE_FAILED: 'Failed to update plan',
  UPDATED: 'Subscription plan updated',
  PLAN_NOT_FOUND: 'Unable to find selected plan',
  VERSION_CREATE_FAILED: 'Failed to create plan version',
  VERSION_CREATED: 'New subscription plan version created',
} as const;

export const ADMIN_REPORT_MESSAGES = {
  LOAD_FAILED: 'Failed to load reports',
  REVIEW_FAILED: 'Failed to review report',
  REVIEWED: 'Report reviewed',
  UPDATE_FAILED: 'Failed to update report',
  UNDER_REVIEW: 'Marked under review',
  UPDATED: 'Report updated',
} as const;

export const ADMIN_CONFIG_MESSAGES = {
  KEY_REQUIRED: 'Key is required',
  KEY_INVALID: 'Invalid system config key',
  VALUE_REQUIRED: 'Value is required',
  UPDATED: 'System config updated',
} as const;
