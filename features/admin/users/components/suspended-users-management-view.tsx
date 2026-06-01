'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { getSuspensionTimelineAction } from '@/actions/admin/report.actions';
import {
  ISuspendedUserItem,
  ISuspensionTimelineItem,
} from '@/types/fraud-report.type';
import { ADMIN_USER_MESSAGES } from '@/constants/admin/messages.constants';
import { buildSuspendedUsersSearchParams } from '@/lib/admin-search-params';
import { toast } from 'sonner';
import { SuspendedUsersTable } from './suspended-users-table';
import { SuspensionTimeline } from './suspension-timeline';

type SuspendedUsersManagementViewProps = {
  page: number;
  search: string;
  users: ISuspendedUserItem[];
  total: number;
  totalPages: number;
  error: string | null;
};

export function SuspendedUsersManagementView({
  page,
  search,
  users,
  total,
  totalPages,
  error,
}: SuspendedUsersManagementViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [timeline, setTimeline] = useState<ISuspensionTimelineItem[]>([]);
  const [timelineUserId, setTimelineUserId] = useState<string | null>(null);

  function navigate(next: { page: number; search: string }) {
    const query = buildSuspendedUsersSearchParams(next);
    startTransition(() => {
      router.push(
        query ? `/admin/users/suspended?${query}` : '/admin/users/suspended'
      );
    });
  }

  const openTimeline = async (userId: string) => {
    const res = await getSuspensionTimelineAction(userId);
    if (!res.success) {
      toast.error(res.error ?? ADMIN_USER_MESSAGES.TIMELINE_FETCH_FAILED);
      return;
    }
    setTimelineUserId(userId);
    setTimeline(res.data ?? []);
  };

  return (
    <div className="container mx-auto px-2 py-6">
      <h1 className="text-3xl font-bold mb-2">Suspended Users</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Track temporary and permanent suspensions with timeline.
      </p>
      <div className="mb-4 rounded-xl border border-border bg-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={search}
            onChange={(e) => navigate({ search: e.target.value, page: 1 })}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Search by user name or email"
          />
          <div className="text-sm text-muted-foreground flex items-center">
            Total suspended users: {total}
          </div>
        </div>
      </div>
      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <SuspendedUsersTable
        users={users}
        loading={isPending}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={(nextPage) => navigate({ page: nextPage, search })}
        onOpenTimeline={openTimeline}
      />
      {timelineUserId ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">
            Suspension timeline for {timelineUserId}
          </h2>
          <SuspensionTimeline items={timeline} />
        </div>
      ) : null}
    </div>
  );
}
