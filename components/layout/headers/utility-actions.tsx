'use client';

import Link from 'next/link';
import { Crown, Wallet } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { NotificationDropdown } from './notification-dropdown';
import { UserDropdown } from './user-dropdown';

export function UtilityActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
      <Link
        data-testid="utility-actions-wallet-link"
        href="/profile/wallet"
        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-2 text-[13px] font-medium shadow-[var(--surface-shadow-sm)] hover:bg-muted/40 sm:px-3.5"
      >
        <Wallet className="size-3.5 shrink-0 text-brand-600" />
        <span className="text-foreground">Wallet</span>
      </Link>
      <Link
        data-testid="utility-actions-plans-link"
        href="/profile/subscription"
        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-2 text-[13px] font-medium shadow-[var(--surface-shadow-sm)] hover:bg-muted/40 sm:px-3.5"
      >
        <Crown className="size-3.5 shrink-0 text-brand-600" />
        <span className="text-foreground">Plans</span>
      </Link>
      <div data-testid="notification-dropdown">
        <NotificationDropdown />
      </div>
      <div data-testid="mode-toggle">
        <ModeToggle />
      </div>
      <div data-testid="user-dropdown">
        <UserDropdown />
      </div>
    </div>
  );
}
