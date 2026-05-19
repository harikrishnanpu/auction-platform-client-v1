'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';

import {
  APP_BRAND,
  getAuctionRoomHeaderMeta,
  isAnyAuctionRoomPath,
  isSellerArea,
} from './config/app-nav';
import { AppSidebar } from './app-sidebar';
import { DashboardHeader } from './dashboard-header';
import { AuctionRoomMenuProvider } from './auction-room-menu-context';

interface AppDashboardShellProps {
  children: ReactNode;
}

const PROFILE_HEADER_META: Record<string, { title: string; subtitle: string }> =
  {
    '/profile': {
      title: 'My Profile',
      subtitle: 'Manage your account settings and personal information.',
    },
    '/profile/notifications': {
      title: 'Notifications',
      subtitle: 'Stay updated on bids, auctions, and account activity.',
    },
    '/profile/my-auctions': {
      title: 'My Auctions',
      subtitle: 'Track auctions you have joined, won, or are watching.',
    },
    '/profile/wallet': {
      title: 'Wallet',
      subtitle: 'View your balance, top up funds, and transaction history.',
    },
    '/profile/payments': {
      title: 'Payments',
      subtitle: 'Review your payment history and billing activity.',
    },
    '/profile/subscription': {
      title: 'Subscription',
      subtitle: 'Manage your plan, billing, and membership benefits.',
    },
  };

function getHeaderMeta(pathname: string): {
  title: string;
  subtitle: string;
} | null {
  if (pathname === '/home') {
    return {
      title: `Welcome to ${APP_BRAND}`,
      subtitle: 'Discover, Bid & Win Exciting Auctions.',
    };
  }
  if (pathname === '/seller/dashboard') {
    return {
      title: 'Seller Dashboard',
      subtitle: 'Manage your auctions, track sales and payments',
    };
  }
  if (pathname === '/auctions') {
    return {
      title: 'All Auctions',
      subtitle: 'Discover, bid & win exciting lots across every category.',
    };
  }
  if (PROFILE_HEADER_META[pathname]) {
    return PROFILE_HEADER_META[pathname];
  }
  return getAuctionRoomHeaderMeta(pathname);
}

export function AppDashboardShell({ children }: AppDashboardShellProps) {
  const pathname = usePathname() ?? '';
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerMeta = getHeaderMeta(pathname);
  const isSeller = isSellerArea(pathname);
  const isAuctionRoom = isAnyAuctionRoomPath(pathname);

  const containerClass = isAuctionRoom
    ? 'mx-auto w-full max-w-[1480px] flex-1 px-3 py-3 sm:px-4 sm:py-4 lg:px-5'
    : headerMeta
      ? 'mx-auto w-full max-w-[1320px] flex-1 px-3.5 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6'
      : 'mx-auto w-full max-w-[1320px] flex-1 px-3.5 py-4 sm:px-5 lg:px-6';

  const mainContent = (
    <>
      {headerMeta ? (
        <DashboardHeader
          title={headerMeta.title}
          subtitle={headerMeta.subtitle}
          onMenuOpen={() => setMobileOpen(true)}
        />
      ) : !isAuctionRoom ? (
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-1 text-foreground"
            aria-label="Open menu"
          >
            <Menu className="size-6" strokeWidth={2} />
          </button>
          {isSeller ? (
            <span className="text-sm font-semibold text-brand-600">Seller</span>
          ) : null}
        </div>
      ) : null}
      <main
        className={
          headerMeta
            ? pathname.startsWith('/profile')
              ? 'mt-5 sm:mt-6'
              : isAuctionRoom
                ? 'mt-3 sm:mt-4'
                : 'mt-4'
            : 'mt-2'
        }
      >
        {children}
      </main>
    </>
  );

  return (
    <div className="flex min-h-screen bg-app-shell">
      <AppSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className={containerClass}>
          {isAuctionRoom ? (
            <AuctionRoomMenuProvider onMenuOpen={() => setMobileOpen(true)}>
              {mainContent}
            </AuctionRoomMenuProvider>
          ) : (
            mainContent
          )}
        </div>
      </div>
    </div>
  );
}
