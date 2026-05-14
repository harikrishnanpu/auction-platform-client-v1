import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface HomeLiveSatisfactionStripProps {
  liveLotsOnHome: number;
  className?: string;
}

/** Trust strip for the live auctions row (static satisfaction score + live count). */
export function HomeLiveSatisfactionStrip({
  liveLotsOnHome,
  className,
}: HomeLiveSatisfactionStripProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'size-3.5 shrink-0',
                i < 4
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-amber-400/35 text-amber-400/55'
              )}
            />
          ))}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold tabular-nums text-foreground">
            4.9{' '}
            <span className="font-normal text-muted-foreground">
              live-room satisfaction
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            From post-session buyer feedback on hosted lots.
          </p>
        </div>
      </div>
      <p className="shrink-0 text-[11px] text-muted-foreground sm:text-right">
        <span className="font-semibold tabular-nums text-foreground">
          {liveLotsOnHome}
        </span>{' '}
        live {liveLotsOnHome === 1 ? 'lot' : 'lots'} in this row
      </p>
    </div>
  );
}
