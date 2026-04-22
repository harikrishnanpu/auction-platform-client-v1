'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getSuspendedUsersAction,
  getSuspensionTimelineAction,
} from '@/actions/admin/report.actions';
import {
  ISuspendedUserItem,
  ISuspensionTimelineItem,
} from '@/types/fraud-report.type';
import { toast } from 'sonner';
import { SuspendedUsersTable } from './suspended-users-table';
import { SuspensionTimeline } from './suspension-timeline';

export function SuspendedUsersManagementView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<ISuspendedUserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [timeline, setTimeline] = useState<ISuspensionTimelineItem[]>([]);
  const [timelineUserId, setTimelineUserId] = useState<string | null>(null);

  const fetchSuspended = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSuspendedUsersAction({ page, limit: 10, search });
      if (!res.success) {
        toast.error(res.error ?? 'Failed to load suspended users');
        return;
      }
      setUsers(res.data?.users ?? []);
      setTotal(res.data?.total ?? 0);
      setTotalPages(res.data?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSuspended();
  }, [fetchSuspended]);

  const openTimeline = async (userId: string) => {
    const res = await getSuspensionTimelineAction(userId);
    if (!res.success) {
      toast.error(res.error ?? 'Failed to fetch timeline');
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
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Search by user name or email"
          />
          <div className="text-sm text-muted-foreground flex items-center">
            Total suspended users: {total}
          </div>
        </div>
      </div>
      <SuspendedUsersTable
        users={users}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
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
