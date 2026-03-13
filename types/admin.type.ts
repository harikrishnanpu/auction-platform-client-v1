import { AuthProvider, UserRole, UserStatus } from './user.type';

export interface IgetllUsersParams {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: 'asc' | 'desc';
  role: UserRole | 'ALL';
  status: UserStatus | 'ALL';
  authProvider: AuthProvider | 'ALL';
}

export interface IgetllSellersParams {
  page: number;
  limit: number;
  pendingOnly?: boolean;
}
