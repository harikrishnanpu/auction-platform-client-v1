'use client';

import Link from 'next/link';
import { ArrowLeft, Menu } from 'lucide-react';

import { DashboardUtilityActions } from '@/components/layout/dashboard-utility-actions';
import { useAuctionRoomMenu } from '@/components/layout/contexts/auction-room-menu-context';

export function UserAuctionRoomTopBar() {
  const onMenuOpen = useAuctionRoomMenu();

  return (
    <header className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {onMenuOpen ? (
          <button
            type="button"
            onClick={onMenuOpen}
            className="-ml-1 p-1 text-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-6" strokeWidth={2} />
          </button>
        ) : null}
        <Link
          href="/auctions"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Auctions
        </Link>
      </div>
      <DashboardUtilityActions />
    </header>
  );
}
