import Link from 'next/link';
import { ArrowRight, Wallet } from 'lucide-react';

import { appCardInteractive, appIconBadge } from '@/lib/app-design';
import { cn } from '@/lib/utils';

export function HomeWalletLinkCard({ className }: { className?: string }) {
  return (
    <Link
      href="/profile/wallet"
      className={cn(appCardInteractive(), className)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={appIconBadge('size-10 shrink-0 rounded-xl')}>
            <Wallet className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              Wallet
            </p>
            <p className="text-xs text-muted-foreground">
              Balance & transactions
            </p>
          </div>
        </div>
        <ArrowRight
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </div>
    </Link>
  );
}
