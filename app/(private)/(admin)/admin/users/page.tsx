import { getAllUsersAction } from '@/actions/admin/admin.actions';
import { UserManagementView } from '@/features/admin/users/components/user-management-view';
import {
  parseAdminUserFilters,
  toAdminUsersActionParams,
} from '@/lib/admin-search-params';
import type { User } from '@/features/admin/users/components/user-table';

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const { filters, page } = parseAdminUserFilters(params);
  const res = await getAllUsersAction(toAdminUsersActionParams(filters, page));

  return (
    <UserManagementView
      filters={filters}
      page={page}
      users={(res.success ? res.data?.users : []) as User[]}
      totalPages={res.success ? (res.data?.totalPages ?? 1) : 1}
      totalUsers={res.success ? (res.data?.total ?? 0) : 0}
      error={res.success ? null : (res.error ?? 'Failed to load users')}
    />
  );
}
