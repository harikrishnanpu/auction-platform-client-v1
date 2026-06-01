'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { PaginationControls } from '@/features/user/notifications/components/PaginationControls';
import {
  ProfilePageCard,
  ProfilePageShell,
} from '@/features/user/profile/components/profile-page-shell';
import type { IUserNotificationsPage } from '../types/notifications.types';

import { NotificationList } from './NotificationList';

type ProfileNotificationsViewProps = {
  page: number;
  data: IUserNotificationsPage | null;
  error: string | null;
};

export function ProfileNotificationsView({
  page,
  data,
  error,
}: ProfileNotificationsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const totalPages = data?.totalPages ?? 1;

  function goToPage(nextPage: number) {
    const q = nextPage > 1 ? `?page=${nextPage}` : '';
    startTransition(() => {
      router.push(`/profile/notifications${q}`);
    });
  }

  return (
    <ProfilePageShell>
      <ProfilePageCard>
        {isPending ? (
          <p className="py-12 text-center text-[13px] text-muted-foreground">
            Loading…
          </p>
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
              onPrev={() => goToPage(Math.max(1, page - 1))}
              onNext={() => goToPage(Math.min(totalPages, page + 1))}
            />
          </div>
        )}
      </ProfilePageCard>
    </ProfilePageShell>
  );
}
