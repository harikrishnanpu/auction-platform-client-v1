'use client';

import { useMemo, useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { PaginationControls } from '@/features/user/notifications/components/PaginationControls';
import {
  ProfilePageCard,
  ProfilePageShell,
} from '@/features/user/profile/components/profile-page-shell';

import { useUserNotificationsPage } from '../hooks/use-user-notifications-page';
import { NotificationList } from './NotificationList';

export function ProfileNotificationsView() {
  const limit = 10;
  const [page, setPage] = useState(1);

  const { data, loading, error } = useUserNotificationsPage({ page, limit });

  const totalPages = useMemo(() => data?.totalPages ?? 1, [data?.totalPages]);

  return (
    <ProfilePageShell>
      <ProfilePageCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13px] text-destructive">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {data ? (
              <p className="text-[13px] text-muted-foreground">
                {data.total} total notification{data.total === 1 ? '' : 's'}
              </p>
            ) : null}
            <NotificationList items={data?.items ?? []} />
            <PaginationControls
              page={data?.page ?? page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        )}
      </ProfilePageCard>
    </ProfilePageShell>
  );
}
