'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, ChevronDown, Crown, Menu, Wallet } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/features/user/notifications/hooks/use-notifications';
import useUserStore from '@/store/user.store';
import { AuthProvider } from '@/types/user.type';
import { getUserAvatarUrl } from '@/utils/auction-utils';

import { useAuctionRoomMenu } from './auction-room-menu-context';
import { isSellerArea } from './config/app-nav';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onMenuOpen: () => void;
}

function HomeSellerPill({ isSeller }: { isSeller: boolean }) {
  return (
    <div className="inline-flex w-full max-w-[240px] shrink-0 rounded-full border border-border bg-muted/40 p-0.5 lg:w-auto">
      <Link
        href="/home"
        className={cn(
          'flex-1 rounded-full px-4 py-1.5 text-center text-[13px] font-semibold transition-colors lg:flex-none lg:px-5',
          !isSeller
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Home
      </Link>
      <Link
        href="/seller/dashboard"
        className={cn(
          'flex-1 rounded-full px-4 py-1.5 text-center text-[13px] font-semibold transition-colors lg:flex-none lg:px-5',
          isSeller
            ? 'bg-brand-600 text-white shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Seller
      </Link>
    </div>
  );
}

function UtilityActions({
  notifRef,
  notifOpen,
  setNotifOpen,
  totalCount,
  notificationsLoading,
  notificationsError,
  notifications,
  menuRef,
  menuOpen,
  setMenuOpen,
  avatarNode,
  userFirstName,
}: {
  notifRef: React.RefObject<HTMLDivElement | null>;
  notifOpen: boolean;
  setNotifOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalCount: number;
  notificationsLoading: boolean;
  notificationsError: string | null;
  notifications: { id: string; title: string; message: string }[];
  menuRef: React.RefObject<HTMLDivElement | null>;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  avatarNode: React.ReactNode;
  userFirstName: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
      <Link
        href="/profile/wallet"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-[13px] font-medium shadow-sm hover:bg-muted/50 sm:px-3"
      >
        <Wallet className="size-3.5 shrink-0 text-brand-600" />
        <span>Wallet</span>
      </Link>
      <Link
        href="/profile/subscription"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-[13px] font-medium shadow-sm hover:bg-muted/50 sm:px-3"
      >
        <Crown className="size-3.5 shrink-0 text-brand-600" />
        <span>Plans</span>
      </Link>

      <div className="relative" ref={notifRef}>
        <button
          type="button"
          onClick={() => setNotifOpen((v) => !v)}
          className="relative rounded-full border border-border bg-card p-2 shadow-sm hover:bg-muted/50"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          {totalCount > 0 ? (
            <span className="absolute right-1 top-1 size-2 rounded-full bg-brand-600" />
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
          className="flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pr-1.5 pl-1 shadow-sm"
        >
          <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
            {avatarNode}
          </div>
          <span className="max-w-[72px] truncate text-[13px] font-semibold sm:max-w-[100px]">
            {userFirstName}
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

export function DashboardHeader({
  title,
  subtitle,
  onMenuOpen,
}: DashboardHeaderProps) {
  const pathname = usePathname() ?? '';
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

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'HD';
  const isSeller = isSellerArea(pathname);
  const auctionRoomMenuOpen = useAuctionRoomMenu();
  const handleMenuOpen = onMenuOpen ?? auctionRoomMenuOpen ?? undefined;

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

  const avatarNode = user?.avatar_url ? (
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

  const utilityProps = {
    notifRef,
    notifOpen,
    setNotifOpen,
    totalCount,
    notificationsLoading,
    notificationsError,
    notifications,
    menuRef,
    menuOpen,
    setMenuOpen,
    avatarNode,
    userFirstName: user?.name?.split(' ')[0] ?? 'Account',
  };

  return (
    <header className="space-y-3">
      {/* Mobile layout */}
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex items-center gap-3">
          {handleMenuOpen ? (
            <button
              type="button"
              onClick={handleMenuOpen}
              className="-ml-1 p-1 text-foreground"
              aria-label="Open menu"
            >
              <Menu className="size-6" strokeWidth={2} />
            </button>
          ) : null}
          <p className="text-sm font-medium text-muted-foreground">
            Hi, {firstName}!
          </p>
        </div>

        <div className="flex justify-center">
          <HomeSellerPill isSeller={isSeller} />
        </div>

        <UtilityActions {...utilityProps} />

        <div className="min-w-0">
          <h1 className="app-page-title">{title}</h1>
          <p className="mt-0.5 app-page-subtitle">{subtitle}</p>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden gap-6 lg:flex lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted-foreground">
            Hi, {firstName}!
          </p>
          <h1 className="mt-0.5 app-page-title">{title}</h1>
          <p className="mt-0.5 app-page-subtitle">{subtitle}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3 xl:flex-row xl:items-center xl:gap-4">
          <HomeSellerPill isSeller={isSeller} />
          <UtilityActions {...utilityProps} />
        </div>
      </div>
    </header>
  );
}
