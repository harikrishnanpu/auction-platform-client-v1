import { getAdminUserAction } from '@/actions/admin/admin.actions';
import { UserDetailView } from '@/features/admin/users/components/user-detail-view';

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getAdminUserAction(id);

  return (
    <UserDetailView
      user={res.success ? (res.data ?? null) : null}
      error={res.success ? null : (res.error ?? 'Failed to load user details.')}
    />
  );
}
