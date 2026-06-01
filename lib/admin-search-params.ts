import type { UserFilterState } from '@/features/admin/users/components/user-filters';
import { DEFAULT_FILTERS as USER_DEFAULT_FILTERS } from '@/features/admin/users/components/user-filters';
import type { ReportFilterState } from '@/features/admin/reports/components/report-filters';
import { DEFAULT_REPORT_FILTERS } from '@/features/admin/reports/components/report-filters';
import type { FraudReportStatus } from '@/types/fraud-report.type';
import type { AuthProvider, UserRole, UserStatus } from '@/types/user.type';
import type { IgetllUsersParams } from '@/types/admin.type';

function readString(
  params: Record<string, string | string[] | undefined>,
  key: string,
  fallback: string
): string {
  const raw = params[key];
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  return fallback;
}

function readNumber(
  params: Record<string, string | string[] | undefined>,
  key: string,
  fallback: number
): number {
  const raw = readString(params, key, String(fallback));
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function readOrder(
  params: Record<string, string | string[] | undefined>
): 'asc' | 'desc' {
  return readString(params, 'order', 'desc') === 'asc' ? 'asc' : 'desc';
}

function readBool(
  params: Record<string, string | string[] | undefined>,
  key: string
): boolean {
  return readString(params, key, '') === '1';
}

export function parseAdminUserFilters(
  params: Record<string, string | string[] | undefined>
): { filters: UserFilterState; page: number } {
  const role = readString(params, 'role', 'all');
  const status = readString(params, 'status', 'all');
  const authProvider = readString(params, 'authProvider', 'all');

  return {
    page: readNumber(params, 'page', 1),
    filters: {
      search: readString(params, 'search', ''),
      sort: readString(params, 'sort', USER_DEFAULT_FILTERS.sort),
      order: readOrder(params),
      limit: readNumber(params, 'limit', USER_DEFAULT_FILTERS.limit),
      role: role === 'all' ? 'all' : (role as UserRole),
      status: status === 'all' ? 'all' : (status as UserStatus),
      authProvider:
        authProvider === 'all' ? 'all' : (authProvider as AuthProvider),
    },
  };
}

export function buildAdminUserSearchParams(
  filters: UserFilterState,
  page: number
): string {
  const q = new URLSearchParams();

  if (filters.search.trim()) q.set('search', filters.search.trim());
  if (filters.role !== 'all') q.set('role', filters.role);
  if (filters.status !== 'all') q.set('status', filters.status);
  if (filters.authProvider !== 'all') {
    q.set('authProvider', filters.authProvider);
  }
  if (filters.sort !== USER_DEFAULT_FILTERS.sort) q.set('sort', filters.sort);
  if (filters.order !== USER_DEFAULT_FILTERS.order) {
    q.set('order', filters.order);
  }
  if (filters.limit !== USER_DEFAULT_FILTERS.limit) {
    q.set('limit', String(filters.limit));
  }
  if (page !== 1) q.set('page', String(page));

  return q.toString();
}

export function toAdminUsersActionParams(
  filters: UserFilterState,
  page: number
): IgetllUsersParams {
  return {
    page,
    limit: filters.limit,
    search: filters.search,
    sort: filters.sort,
    order: filters.order,
    role: filters.role === 'all' ? 'ALL' : filters.role,
    status: filters.status === 'all' ? 'ALL' : filters.status,
    authProvider: filters.authProvider === 'all' ? 'ALL' : filters.authProvider,
  };
}

export function parseAdminSellerListParams(
  params: Record<string, string | string[] | undefined>
): { page: number; limit: number; pendingOnly: boolean } {
  return {
    page: readNumber(params, 'page', 1),
    limit: readNumber(params, 'limit', 10),
    pendingOnly: readBool(params, 'pendingOnly'),
  };
}

export function buildAdminSellerListSearchParams(input: {
  page: number;
  limit: number;
  pendingOnly: boolean;
}): string {
  const q = new URLSearchParams();

  if (input.page !== 1) q.set('page', String(input.page));
  if (input.limit !== 10) q.set('limit', String(input.limit));
  if (input.pendingOnly) q.set('pendingOnly', '1');

  return q.toString();
}

export function parseReportFilters(
  params: Record<string, string | string[] | undefined>
): { filters: ReportFilterState; page: number } {
  const status = readString(params, 'status', 'ALL');
  const validStatuses = new Set(['ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED']);

  return {
    page: readNumber(params, 'page', 1),
    filters: {
      search: readString(params, 'search', ''),
      status: validStatuses.has(status)
        ? (status as FraudReportStatus | 'ALL')
        : DEFAULT_REPORT_FILTERS.status,
      limit: readNumber(params, 'limit', DEFAULT_REPORT_FILTERS.limit),
    },
  };
}

export function buildReportSearchParams(
  filters: ReportFilterState,
  page: number
): string {
  const q = new URLSearchParams();

  if (filters.search.trim()) q.set('search', filters.search.trim());
  if (filters.status !== 'ALL') q.set('status', filters.status);
  if (filters.limit !== DEFAULT_REPORT_FILTERS.limit) {
    q.set('limit', String(filters.limit));
  }
  if (page !== 1) q.set('page', String(page));

  return q.toString();
}

export function parseSuspendedUsersParams(
  params: Record<string, string | string[] | undefined>
): { page: number; search: string } {
  return {
    page: readNumber(params, 'page', 1),
    search: readString(params, 'search', ''),
  };
}

export function buildSuspendedUsersSearchParams(input: {
  page: number;
  search: string;
}): string {
  const q = new URLSearchParams();

  if (input.search.trim()) q.set('search', input.search.trim());
  if (input.page !== 1) q.set('page', String(input.page));

  return q.toString();
}
