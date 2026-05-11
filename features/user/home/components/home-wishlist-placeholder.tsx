import { Heart } from 'lucide-react';

import { cn } from '@/lib/utils';

export function HomeWishlistPlaceholder({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'rounded-[12px] border border-border/80 bg-[#f5f5f5] p-4 dark:bg-muted/40',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <Heart className="size-4 text-foreground/70" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Wishlist
          </h2>
          <p className="text-[11px] text-muted-foreground">Coming soon</p>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Save auctions you care about and get notified before they go live.
      </p>
    </section>
  );
}
