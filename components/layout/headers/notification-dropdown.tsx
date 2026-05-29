'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '@/features/user/notifications/hooks/use-notifications';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, totalCount, loading, error } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full border border-border bg-card p-2 shadow-sm hover:bg-muted/50"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        {totalCount > 0 && (
          <span className="absolute right-1 top-1 size-2 rounded-full bg-brand-600" />
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 flex max-h-80 w-[min(100vw-2rem,20rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="font-semibold text-foreground">Notifications</span>
            <Link
              href="/profile/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-brand-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                Loading…
              </p>
            ) : error ? (
              <p className="px-4 py-3 text-sm text-destructive">{error}</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="border-b border-border px-4 py-3 last:border-0"
                >
                  <p className="text-sm font-medium text-foreground">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {n.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
