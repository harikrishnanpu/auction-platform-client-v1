import { getUserNotificationsAction } from '@/actions/user/notifications.actions';
import { ProfileNotificationsView } from '@/features/user/notifications/components/ProfileNotificationsView';
import { readPageParam } from '@/lib/listing-search-params';

const PAGE_LIMIT = 10;

export default async function ProfileNotificationsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const page = readPageParam(params);

  const res = await getUserNotificationsAction({ page, limit: PAGE_LIMIT });

  return (
    <section>
      <ProfileNotificationsView
        page={page}
        limit={PAGE_LIMIT}
        data={res.success ? (res.data ?? null) : null}
        error={
          res.success ? null : (res.error ?? 'Failed to load notifications')
        }
      />
    </section>
  );
}
