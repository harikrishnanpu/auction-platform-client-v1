import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Gavel,
  Timer,
  TrendingUp,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { IAuctionDto } from '@/types/auction.type';
import { formatAuctionPrice, getAuctionAssetUrl } from '@/utils/auction-utils';

import { AuctionCardCover } from './auction-card-cover';
import {
  type AuctionCardDisplay,
  getAuctionCardDisplay,
} from '../utils/auction-card.utils';

export { AuctionCardSkeleton } from './auction-card-skeleton';

// ── Types ───────────────────────────────────────────────────────────────────

export interface AuctionCardProps {
  auction: IAuctionDto;
  href?: string;
  className?: string;
  /** Dense grid for browse / listing pages */
  size?: 'default' | 'compact';
  /** Shown on cover (bids when live, watchers otherwise). */
  bidCount?: number;
  watcherCount?: number;
  /** Used on LIVE cards; defaults to startPrice when unknown. */
  currentBid?: number;
}

// ── Status pill ──────────────────────────────────────────────────────────────

type PillVariant = 'live' | 'upcoming' | 'ended' | 'paused' | 'neutral';

const PILL_STYLES: Record<PillVariant, string> = {
  live: 'bg-brand-600 text-white ring-brand-600/30',
  upcoming:
    'bg-brand-50 text-brand-700 ring-brand-200 dark:bg-brand-950/50 dark:text-brand-300',
  ended: 'bg-muted text-muted-foreground ring-border',
  paused: 'bg-amber-500/90 text-white ring-amber-300/30',
  neutral: 'bg-muted text-foreground ring-border',
};

function StatusPill({
  label,
  variant,
}: {
  label: string;
  variant: PillVariant;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
        'text-[10px] font-semibold uppercase tracking-wider ring-1',
        PILL_STYLES[variant]
      )}
    >
      {variant === 'live' && (
        <span className="inline-block size-1.5 animate-pulse rounded-full bg-current opacity-90" />
      )}
      {label}
    </span>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function pillConfigFor(display: AuctionCardDisplay): {
  label: string;
  variant: PillVariant;
} {
  if (display.isLive) return { label: 'Live', variant: 'live' };
  if (display.isUpcoming) return { label: 'Upcoming', variant: 'upcoming' };
  if (display.statusPillKind === 'paused')
    return { label: 'Paused', variant: 'paused' };
  if (display.isSold) return { label: 'Sold', variant: 'ended' };
  if (display.isCancelled) return { label: 'Cancelled', variant: 'ended' };
  if (display.isDraft) return { label: 'Draft', variant: 'neutral' };
  return { label: 'Ended', variant: 'ended' };
}

function formatRelative(target: Date | string, prefix: string): string {
  const ms = new Date(String(target)).getTime() - Date.now();
  if (!Number.isFinite(ms)) return '—';
  if (ms <= 0) return 'Ending now';
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${prefix} ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${prefix} ${hours}h ${mins % 60}m`;
  const days = Math.floor(hours / 24);
  return `${prefix} ${days}d ${hours % 24}h`;
}

function formatAgo(target: Date | string): string {
  const ms = Date.now() - new Date(String(target)).getTime();
  if (!Number.isFinite(ms) || ms < 0) return '—';
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Small reusable row ──────────────────────────────────────────────────────

function MetaRow({
  icon,
  label,
  accent,
  className,
}: {
  icon: ReactNode;
  label: string;
  accent: 'live' | 'upcoming' | 'muted';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 max-w-[50%] items-center gap-1 text-[11px] font-medium tabular-nums',
        accent === 'live' && 'text-red-500',
        accent === 'upcoming' && 'text-brand-600',
        accent === 'muted' && 'text-muted-foreground',
        className
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </div>
  );
}

// ── CTA ─────────────────────────────────────────────────────────────────────

function CardCTA({
  display,
  href,
  compact,
}: {
  display: AuctionCardDisplay;
  href: string;
  compact?: boolean;
}) {
  const btn = compact
    ? 'py-1.5 text-[11px] rounded-md'
    : 'py-2 text-xs rounded-md';
  if (display.isLive) {
    return (
      <Link
        href={href}
        className={cn(
          'flex w-full items-center justify-center gap-1 font-semibold',
          btn,
          'rounded-full bg-brand-600 text-white shadow-sm transition-colors hover:bg-brand-700',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        )}
      >
        Place bid
        <ArrowRight className="size-3" aria-hidden />
      </Link>
    );
  }
  if (display.isUpcoming) {
    return (
      <Link
        href={href}
        className={cn(
          'flex w-full items-center justify-center gap-1 border border-border font-semibold',
          btn,
          'bg-background text-foreground transition-colors hover:bg-muted/80'
        )}
      >
        <Bell className="size-3" aria-hidden />
        Remind me
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        'flex w-full items-center justify-center gap-1 border border-border bg-muted/50 font-semibold text-muted-foreground',
        compact
          ? 'py-1.5 text-[11px] rounded-md'
          : 'py-1.5 text-[12px] rounded-md',
        'transition-colors hover:bg-muted'
      )}
    >
      <CheckCircle2 className="size-3" aria-hidden />
      View result
    </Link>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export function AuctionCard({
  auction,
  href = `/auction/${auction.id}`,
  className,
  size = 'default',
  bidCount,
  watcherCount,
  currentBid,
}: AuctionCardProps) {
  const compact = size === 'compact';
  const display = getAuctionCardDisplay(auction);
  const pill = pillConfigFor(display);

  const asset0 = auction.assets?.[0];
  const url = getAuctionAssetUrl(asset0?.fileKey);
  const showImage = Boolean(url) && asset0?.assetType !== 'VIDEO';

  const coverCount = bidCount ?? watcherCount ?? 0;
  const coverLabel = display.isLive
    ? 'bids'
    : display.isClosed
      ? 'closed'
      : 'watching';

  const priceValue = display.isLive
    ? (currentBid ?? auction.startPrice)
    : display.showFinalPriceRow
      ? (currentBid ?? auction.startPrice)
      : auction.startPrice;
  const priceLabel = display.isLive
    ? 'Current bid'
    : display.showFinalPriceRow
      ? 'Final price'
      : 'Start price';

  const meta = display.isLive
    ? {
        accent: 'live' as const,
        icon: <Timer className="size-3" aria-hidden />,
        label: formatRelative(auction.endAt, 'Ends in'),
      }
    : display.isUpcoming
      ? {
          accent: 'upcoming' as const,
          icon: <Timer className="size-3" aria-hidden />,
          label: formatRelative(auction.startAt, 'Opens in'),
        }
      : {
          accent: 'muted' as const,
          icon: <CheckCircle2 className="size-3" aria-hidden />,
          label: `Ended ${formatAgo(auction.endAt)}`,
        };

  return (
    <div
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm',
        'transition-[border-color,box-shadow] duration-200',
        'hover:border-brand-600/25 hover:shadow-md',
        display.isClosed && 'opacity-85',
        compact && 'rounded-md',
        className
      )}
    >
      {/* Cover */}
      <Link
        href={href}
        className="relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Open: ${auction.title}`}
        tabIndex={display.isClosed ? -1 : undefined}
      >
        {showImage ? (
          <AuctionCardCover
            title={auction.title}
            imageUrl={url}
            showImage
            aspect={compact ? '4/3' : '5/4'}
            className="h-full w-full"
          />
        ) : (
          <div
            className={cn(
              'flex w-full items-center justify-center bg-muted',
              compact ? 'aspect-4/3' : 'aspect-5/4'
            )}
          >
            <Gavel
              className={cn(
                'text-muted-foreground/25',
                compact ? 'size-8' : 'size-10'
              )}
              aria-hidden
            />
          </div>
        )}

        <div
          className={cn(
            'absolute z-10',
            compact ? 'left-1.5 top-1.5' : 'left-2 top-2'
          )}
        >
          <StatusPill label={pill.label} variant={pill.variant} />
        </div>

        {coverCount > 0 && (
          <div
            className={cn(
              'absolute right-1.5 top-1.5 z-10 flex items-center gap-0.5 rounded-full bg-black/60 px-1 py-0.5 font-semibold text-white backdrop-blur-sm',
              compact ? 'text-[9px]' : 'text-[10px] gap-1 px-1.5 py-0.5'
            )}
          >
            <TrendingUp className="size-2.5" aria-hidden />
            <span className="tabular-nums">{coverCount}</span>
            <span className="text-white/70">{coverLabel}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          compact ? 'gap-1 p-2' : 'gap-2 p-2.5'
        )}
      >
        <Link
          href={href}
          className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <h3
            className={cn(
              'line-clamp-2 font-semibold leading-snug text-foreground transition-colors group-hover:text-brand-600',
              compact ? 'text-[11px] leading-tight' : 'text-[13px]'
            )}
          >
            {auction.title}
          </h3>
        </Link>

        <div
          className={cn(
            'flex items-center gap-1 font-medium uppercase tracking-wide text-muted-foreground',
            compact ? 'text-[9px]' : 'text-[10px] gap-1.5'
          )}
        >
          <span className="truncate">{auction.category?.name ?? '—'}</span>
          <span
            className="size-1 shrink-0 rounded-full bg-border"
            aria-hidden
          />
          <span className="truncate">{auction.condition}</span>
        </div>

        <div className="flex items-end justify-between gap-1.5">
          <div className="min-w-0">
            <p
              className={cn(
                'font-semibold uppercase tracking-wider text-muted-foreground',
                compact ? 'text-[8px]' : 'text-[9px]'
              )}
            >
              {priceLabel}
            </p>
            <p
              className={cn(
                'truncate font-bold tabular-nums leading-tight',
                compact ? 'text-sm' : 'text-sm',
                display.isLive ? 'text-brand-600' : 'text-foreground'
              )}
            >
              {formatAuctionPrice(priceValue)}
            </p>
          </div>
          <MetaRow
            icon={meta.icon}
            label={meta.label}
            accent={meta.accent}
            className={compact ? 'max-w-[46%] text-[10px]' : undefined}
          />
        </div>

        <div className="mt-auto pt-0.5">
          <CardCTA display={display} href={href} compact={compact} />
        </div>
      </div>
    </div>
  );
}
