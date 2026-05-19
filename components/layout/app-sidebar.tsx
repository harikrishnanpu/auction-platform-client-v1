'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Headphones,
  LogOut,
  Sparkles,
  X,
  type LucideIcon,
} from 'lucide-react';

import { logoutAction } from '@/actions/auth/auth.actions';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/user.store';

import {
  APP_BRAND,
  isSellerArea,
  isSellerAuctionRoomPath,
  isSellerNavActive,
  isSellerRoomNavActive,
  isUserAuctionRoomPath,
  isUserNavActive,
  isUserRoomNavActive,
  SELLER_NAV,
  SELLER_QUICK_ACTIONS,
  SELLER_ROOM_NAV,
  SELLER_ROOM_QUICK_ACTIONS,
  SUPPORT_NAV,
  USER_NAV,
  USER_QUICK_ACTIONS,
  USER_ROOM_NAV,
  USER_ROOM_QUICK_ACTIONS,
  type SellerRoomNavItem,
  type UserRoomNavItem,
} from './config/app-nav';

interface AppSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
        active
          ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
      )}
    >
      <Icon
        className={cn(
          'size-4 shrink-0',
          active && 'text-brand-600 dark:text-brand-400'
        )}
        aria-hidden
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function UserRoomNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: UserRoomNavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const href =
    item.id === 'auction-room' && isUserAuctionRoomPath(pathname)
      ? pathname
      : item.href;
  return (
    <NavLink
      href={href}
      label={item.label}
      icon={item.icon}
      active={isUserRoomNavActive(pathname, item)}
      onNavigate={onNavigate}
    />
  );
}

function SellerRoomNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: SellerRoomNavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const href =
    item.id === 'auction-room' && isSellerAuctionRoomPath(pathname)
      ? pathname
      : item.href;
  return (
    <NavLink
      href={href}
      label={item.label}
      icon={item.icon}
      active={isSellerRoomNavActive(pathname, item)}
      onNavigate={onNavigate}
    />
  );
}

function SidebarBody({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const isSellerRoom = isSellerAuctionRoomPath(pathname);
  const isUserRoom = isUserAuctionRoomPath(pathname);
  const isAuctionRoom = isSellerRoom || isUserRoom;
  const isSeller = isSellerArea(pathname) && !isAuctionRoom;

  const quickActions = isSellerRoom
    ? SELLER_ROOM_QUICK_ACTIONS
    : isUserRoom
      ? USER_ROOM_QUICK_ACTIONS
      : isSeller
        ? SELLER_QUICK_ACTIONS
        : USER_QUICK_ACTIONS;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-3 py-4 sm:px-4 sm:py-5">
      <Link
        href="/home"
        onClick={onNavigate}
        className="mb-4 flex shrink-0 items-center gap-2 px-1"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <span className="text-base font-bold tracking-tight text-foreground">
          {APP_BRAND}
        </span>
      </Link>

      <nav className="space-y-4" aria-label="Main navigation">
        {isSellerRoom ? (
          <div className="space-y-0.5">
            {SELLER_ROOM_NAV.map((item) => (
              <SellerRoomNavLink
                key={item.id}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : isUserRoom ? (
          <div className="space-y-0.5">
            {USER_ROOM_NAV.map((item) => (
              <UserRoomNavLink
                key={item.id}
                item={item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : isSeller ? (
          <div className="space-y-0.5">
            {SELLER_NAV.map((item) => (
              <NavLink
                key={`${item.href}-${item.label}`}
                {...item}
                active={isSellerNavActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {USER_NAV.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                active={isUserNavActive(pathname, item.href)}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

        <div>
          <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Quick actions
          </p>
          <div className="space-y-0.5">
            {quickActions.map((item) => (
              <NavLink
                key={`${item.href}-${item.label}`}
                {...item}
                active={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                }
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2.5 border-t border-border pt-4">
          {isSellerRoom ? (
            <>
              <div className="rounded-lg border border-brand-100 bg-brand-50/80 p-3 dark:border-brand-900 dark:bg-brand-950/40">
                <div className="flex items-start gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white">
                    <Headphones className="size-3.5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Need Help?
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Support for your live auction.
                    </p>
                    <Link
                      href="/profile"
                      onClick={onNavigate}
                      className="mt-1.5 inline-block text-[11px] font-semibold text-brand-600 hover:underline"
                    >
                      Visit Help Center
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href="/home"
                onClick={onNavigate}
                className="flex items-center gap-2 px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to Home
              </Link>
            </>
          ) : isUserRoom ? (
            <>
              <div className="rounded-lg border border-brand-100 bg-brand-50/80 p-3.5 dark:border-brand-900 dark:bg-brand-950/40">
                <p className="text-xs font-semibold text-foreground">
                  Refer &amp; Earn
                </p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  Invite friends and earn rewards when they join auctions.
                </p>
                <Link
                  href="/profile/subscription"
                  onClick={onNavigate}
                  className="mt-2.5 inline-flex h-8 w-full items-center justify-center rounded-lg bg-brand-600 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  Invite Now
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate?.();
                  onLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                Log out
              </button>
            </>
          ) : (
            <>
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Support
              </p>
              <div className="space-y-0.5">
                {SUPPORT_NAV.map((item) => (
                  <NavLink
                    key={`${item.href}-${item.label}`}
                    {...item}
                    active={false}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate?.();
                  onLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <LogOut className="size-4 shrink-0" aria-hidden />
                Log out
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export function AppSidebar({ mobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname() ?? '';
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    router.replace('/login');
  };

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(100%,260px)] flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          type="button"
          onClick={onMobileClose}
          className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          aria-label="Close sidebar"
        >
          <X className="size-5" />
        </button>
        <SidebarBody
          pathname={pathname}
          onNavigate={onMobileClose}
          onLogout={handleLogout}
        />
      </aside>

      <aside className="hidden lg:flex lg:w-[240px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-card xl:w-[252px]">
        <SidebarBody pathname={pathname} onLogout={handleLogout} />
      </aside>
    </>
  );
}
