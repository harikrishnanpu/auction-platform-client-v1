import Link from 'next/link';
import { ArrowRight, Wallet } from 'lucide-react';

import { cn } from '@/lib/utils';

export function HomeWalletLinkCard({ className }: { className?: string }) {
  return (
    <Link
      href="/profile/wallet"
      className={cn(
        'flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-border hover:bg-muted/30',
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
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
    </Link>
  );
}
