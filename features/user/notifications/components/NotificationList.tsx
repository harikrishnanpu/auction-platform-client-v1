'use client';

import type { IUserNotification } from '../types/notifications.types';
import { NotificationListItem } from './NotificationListItem';

export function NotificationList({ items }: { items: IUserNotification[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((n) => (
        <NotificationListItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
