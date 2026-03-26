'use client';

import type { IUserNotification } from '../types/notifications.types';

export function NotificationListItem({
  notification,
}: {
  notification: IUserNotification;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-xs">
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            notification.isRead ? 'bg-muted-foreground/30' : 'bg-primary'
          }`}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {notification.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {notification.message}
          </p>
        </div>
      </div>
    </div>
  );
}
