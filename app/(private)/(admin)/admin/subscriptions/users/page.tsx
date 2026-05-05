import { getSubscribedUsersAction } from '@/actions/admin/admin.actions';
import { SubscribedUsersView } from '@/features/admin/subscriptions/components/subscribed-users-view';

export default async function AdminSubscribedUsersPage() {
  const response = await getSubscribedUsersAction();
  const subscriptions = response.success
    ? (response.data?.subscriptions ?? [])
    : [];

  return <SubscribedUsersView subscriptions={subscriptions} />;
}
