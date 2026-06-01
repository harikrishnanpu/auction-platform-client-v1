'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import useUserStore from '@/store/user.store';

import { useAuctionRoomMenu } from '../contexts/auction-room-menu-context';
import { isSellerArea } from '../config/app-nav';
import { HomeSellerPill } from './home-seller-pill';
import { UtilityActions } from './utility-actions';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  onMenuOpen?: () => void;
}

export function DashboardHeader({
  title,
  subtitle,
  onMenuOpen,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user } = useUserStore();
  const isSeller = isSellerArea(pathname ?? '');
  const auctionRoomMenuOpen = useAuctionRoomMenu();
  const handleMenuOpen = onMenuOpen ?? auctionRoomMenuOpen ?? undefined;

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <header className="space-y-3">
      {/* Mobile layout */}
      <div
        data-testid="dashboard-header-mobile-layout"
        className="flex flex-col gap-4 lg:hidden"
      >
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
            Hi, {firstName}
          </p>
        </div>

        <div className="flex justify-center">
          <HomeSellerPill isSeller={isSeller} />
        </div>

        <UtilityActions />

        <div className="min-w-0">
          <h1 className="app-page-title">{title}</h1>
          <p className="mt-0.5 app-page-subtitle">{subtitle}</p>
        </div>
      </div>

      {/* Desktop layout */}
      <div
        data-testid="dashboard-header-desktop-layout"
        className="hidden gap-6 lg:flex lg:items-start lg:justify-between"
      >
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-muted-foreground">
            Hi, {firstName}!
          </p>
          <h1 className="mt-0.5 app-page-title">{title}</h1>
          <p className="mt-0.5 app-page-subtitle">{subtitle}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3 xl:flex-row xl:items-center xl:gap-4">
          <HomeSellerPill isSeller={isSeller} />
          <UtilityActions />
        </div>
      </div>
    </header>
  );
}
