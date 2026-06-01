import { getSuspendedUsersAction } from '@/actions/admin/report.actions';
import { SuspendedUsersManagementView } from '@/features/admin/users/components/suspended-users-management-view';
import { parseSuspendedUsersParams } from '@/lib/admin-search-params';

export default async function SuspendedUsersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const { page, search } = parseSuspendedUsersParams(params);
  const res = await getSuspendedUsersAction({ page, limit: 10, search });

  return (
    <SuspendedUsersManagementView
      page={page}
      search={search}
      users={res.success ? (res.data?.users ?? []) : []}
      total={res.success ? (res.data?.total ?? 0) : 0}
      totalPages={res.success ? (res.data?.totalPages ?? 1) : 1}
      error={
        res.success ? null : (res.error ?? 'Failed to load suspended users')
      }
    />
  );
}
