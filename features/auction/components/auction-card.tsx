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
  /** Shown on cover (bids when live, watchers otherwise). */
  bidCount?: number;
  watcherCount?: number;
  /** Used on LIVE cards; defaults to startPrice when unknown. */
  currentBid?: number;
}

// ── Status pill ──────────────────────────────────────────────────────────────

type PillVariant = 'live' | 'upcoming' | 'ended' | 'paused' | 'neutral';

const PILL_STYLES: Record<PillVariant, string> = {
  live: 'bg-red-500/95 text-white ring-red-300/40',
  upcoming: 'bg-blue-600/95 text-white ring-blue-300/40',
  ended: 'bg-slate-900/75 text-white/85 ring-white/10',
  paused: 'bg-amber-500/95 text-white ring-amber-300/40',
  neutral: 'bg-slate-700/80 text-white ring-white/10',
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
        'text-[10px] font-semibold uppercase tracking-wider ring-1 backdrop-blur-sm',
        PILL_STYLES[variant]
      )}
    >
      {variant === 'live' && (
        <span className="inline-block size-1.5 animate-pulse rounded-full bg-white" />
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
}: {
  icon: ReactNode;
  label: string;
  accent: 'live' | 'upcoming' | 'muted';
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 text-[11px] font-medium tabular-nums',
        accent === 'live' && 'text-red-600 dark:text-red-400',
        accent === 'upcoming' && 'text-blue-600 dark:text-blue-400',
        accent === 'muted' && 'text-muted-foreground'
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
}: {
  display: AuctionCardDisplay;
  href: string;
}) {
  if (display.isLive) {
    return (
      <Link
        href={href}
        className={cn(
          'flex w-full items-center justify-center gap-1 rounded-md',
          'bg-blue-600 py-1.5 text-[12px] font-semibold text-white',
          'transition-colors hover:bg-blue-700',
          'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1'
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
          'flex w-full items-center justify-center gap-1 rounded-md',
          'border border-blue-200 bg-blue-50 py-1.5 text-[12px] font-semibold text-blue-700',
          'transition-colors hover:bg-blue-100',
          'dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300'
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
        'flex w-full items-center justify-center gap-1 rounded-md',
        'border border-border bg-muted/50 py-1.5 text-[12px] font-semibold text-muted-foreground',
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
  bidCount,
  watcherCount,
  currentBid,
}: AuctionCardProps) {
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
        'group relative flex h-full flex-col overflow-hidden rounded-xl',
        'border border-border bg-card shadow-sm',
        'transition-[border-color,transform,box-shadow] duration-200',
        'hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:hover:border-blue-700',
        display.isClosed && 'opacity-85',
        className
      )}
    >
      {/* Cover */}
      <Link
        href={href}
        className="relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`Open: ${auction.title}`}
        tabIndex={display.isClosed ? -1 : undefined}
      >
        {showImage ? (
          <AuctionCardCover
            title={auction.title}
            imageUrl={url}
            showImage
            className="h-full w-full"
          />
        ) : (
          <div className="flex aspect-5/4 w-full items-center justify-center bg-linear-to-br from-slate-800 to-slate-950">
            <Gavel className="size-10 text-white/15" aria-hidden />
          </div>
        )}

        <div className="absolute left-2 top-2 z-10">
          <StatusPill label={pill.label} variant={pill.variant} />
        </div>

        {coverCount > 0 && (
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <TrendingUp className="size-2.5" aria-hidden />
            <span className="tabular-nums">{coverCount}</span>
            <span className="text-white/70">{coverLabel}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-2.5">
        <Link
          href={href}
          className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {auction.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          <span className="truncate">{auction.category?.name ?? '—'}</span>
          <span
            className="size-1 shrink-0 rounded-full bg-border"
            aria-hidden
          />
          <span className="truncate">{auction.condition}</span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              {priceLabel}
            </p>
            <p
              className={cn(
                'truncate text-[15px] font-bold tabular-nums leading-tight',
                display.isLive
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-foreground'
              )}
            >
              {formatAuctionPrice(priceValue)}
            </p>
          </div>
          <MetaRow icon={meta.icon} label={meta.label} accent={meta.accent} />
        </div>

        <div className="mt-auto pt-1">
          <CardCTA display={display} href={href} />
        </div>
      </div>
    </div>
  );
}
