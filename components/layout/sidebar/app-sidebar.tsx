'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, X, type LucideIcon } from 'lucide-react';

import { logoutAction } from '@/actions/auth/auth.actions';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/user.store';

import {
  isSellerArea,
  isSellerNavActive,
  isUserNavActive,
  SELLER_NAV,
  SELLER_QUICK_ACTIONS,
  SUPPORT_NAV,
  USER_NAV,
  USER_QUICK_ACTIONS,
} from '../config/app-nav';
import { Logo } from '../logo/Logo';

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
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors',
        active
          ? 'bg-[var(--surface-nav-active)] text-primary shadow-[var(--surface-shadow-sm)]'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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

function SidebarBody({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}) {
  const isSeller = isSellerArea(pathname);
  const brandHref = isSeller ? '/seller/dashboard' : '/home';
  const mainNav = isSeller ? SELLER_NAV : USER_NAV;
  const quickActions = isSeller ? SELLER_QUICK_ACTIONS : USER_QUICK_ACTIONS;
  const isNavActive = isSeller ? isSellerNavActive : isUserNavActive;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-3 py-5 sm:px-4 sm:py-5">
      <Link
        href={brandHref}
        onClick={onNavigate}
        className="mb-5 flex shrink-0 items-center gap-2 px-1"
      >
        <Logo />
      </Link>

      <nav className="space-y-4" aria-label="Main navigation">
        <div className="space-y-0.5">
          {mainNav.map((item) => (
            <NavLink
              key={`${item.href}-${item.label}`}
              {...item}
              active={isNavActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>

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

      <aside className="hidden lg:flex lg:w-[248px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border/60 lg:bg-card xl:w-[260px]">
        <SidebarBody pathname={pathname} onLogout={handleLogout} />
      </aside>
    </>
  );
}
