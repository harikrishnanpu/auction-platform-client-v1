'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell, ChevronDown, Crown, Wallet } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/features/user/notifications/hooks/use-notifications';
import useUserStore from '@/store/user.store';
import { AuthProvider } from '@/types/user.type';
import { getUserAvatarUrl } from '@/utils/auction-utils';

export function DashboardUtilityActions({ className }: { className?: string }) {
  const { user } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    totalCount,
    loading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();

  const firstName = user?.name?.split(' ')[0] ?? 'Account';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'HD';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const avatarNode: ReactNode = user?.avatar_url ? (
    user.authProvider === AuthProvider.LOCAL ? (
      <Image
        src={getUserAvatarUrl(user.avatar_url)}
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    ) : (
      <Image
        src={user.avatar_url}
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    )
  ) : (
    userInitials
  );

  return (
    <div
      className={cn('flex flex-wrap items-center justify-end gap-2', className)}
    >
      <Link
        href="/profile/wallet"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-muted/50 sm:px-4"
      >
        <Wallet className="size-4 shrink-0 text-brand-600" />
        <span className="hidden sm:inline">Wallet</span>
      </Link>
      <Link
        href="/profile/subscription"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-muted/50 sm:px-4"
      >
        <Crown className="size-4 shrink-0 text-brand-600" />
        <span className="hidden sm:inline">Plans</span>
      </Link>

      <div className="relative" ref={notifRef}>
        <button
          type="button"
          onClick={() => setNotifOpen((v) => !v)}
          className="relative rounded-full border border-border bg-card p-2.5 shadow-sm hover:bg-muted/50"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          {totalCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {totalCount > 9 ? '9+' : totalCount}
            </span>
          ) : null}
        </button>
        {notifOpen ? (
          <div className="absolute right-0 z-50 mt-2 flex max-h-80 w-[min(100vw-2rem,20rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-semibold">Notifications</span>
              <Link
                href="/profile/notifications"
                onClick={() => setNotifOpen(false)}
                className="text-xs text-brand-600 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notificationsLoading ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  Loading…
                </p>
              ) : notificationsError ? (
                <p className="px-4 py-3 text-sm text-destructive">
                  {notificationsError}
                </p>
              ) : notifications.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    className="border-b border-border px-4 py-3 last:border-0"
                  >
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {n.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>

      <ModeToggle />

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pr-2 pl-1.5 shadow-sm"
        >
          <div className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {avatarNode}
          </div>
          <span className="max-w-[100px] truncate text-sm font-semibold">
            {firstName}
          </span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
        {menuOpen ? (
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl">
            <Link
              href="/profile"
              className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              Profile settings
            </Link>
            <Link
              href="/profile/wallet"
              className="block rounded-xl px-3 py-2 text-sm hover:bg-muted"
              onClick={() => setMenuOpen(false)}
            >
              Wallet
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
