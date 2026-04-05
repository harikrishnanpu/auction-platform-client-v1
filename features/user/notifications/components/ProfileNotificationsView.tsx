'use client';

import { useMemo, useState } from 'react';
import { Bell } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import { useUserNotificationsPage } from '../hooks/use-user-notifications-page';
import { NotificationList } from './NotificationList';
import { PaginationControls } from './PaginationControls';

export function ProfileNotificationsView() {
  const limit = 10;
  const [page, setPage] = useState(1);

  const { data, loading, error } = useUserNotificationsPage({ page, limit });

  const totalPages = useMemo(() => data?.totalPages ?? 1, [data?.totalPages]);

  return (
    <section className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
            <Bell className="h-5 w-5" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {data
              ? `${data.total} total notifications`
              : 'Your latest updates and auction results.'}
          </p>
        </div>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardContent className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <div className="space-y-5">
              <NotificationList items={data?.items ?? []} />
              <PaginationControls
                page={data?.page ?? page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
