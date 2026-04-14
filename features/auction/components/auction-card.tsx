import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  Share2,
  Heart,
  TrendingUp,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IAuctionDto } from '@/types/auction.type';
import {
  formatAuctionDateTime,
  formatAuctionPrice,
  getAuctionAssetUrl,
} from '@/utils/auction-utils';
import { AuctionCardCover } from './auction-card-cover';

export { AuctionCardSkeleton } from './auction-card-skeleton';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuctionCardProps {
  auction: IAuctionDto;
  href?: string;
  className?: string;
  showSellerId?: boolean;
  ctaLabel?: string;
  bidCount?: number;
  watcherCount?: number;
  interestPercent?: number;
  currentBid?: number;
  ribbonLabel?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status }: { status: IAuctionDto['status'] }) {
  const config = {
    LIVE: {
      dot: 'bg-red-400 animate-pulse',
      pill: 'bg-black/55 text-white border-white/15',
      label: 'Live Now',
    },
    UPCOMING: {
      dot: 'bg-blue-400',
      pill: 'bg-black/55 text-white border-white/15',
      label: 'Upcoming',
    },
    ENDED: {
      dot: 'bg-slate-400',
      pill: 'bg-black/55 text-white/70 border-white/10',
      label: 'Ended',
    },
  } as const;

  const c = config[status as keyof typeof config] ?? config.ENDED;

  return (
    <span
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-2.5 py-1',
        'text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md',
        c.pill
      )}
    >
      <span
        className={cn('inline-block size-1.5 shrink-0 rounded-full', c.dot)}
      />
      {c.label}
    </span>
  );
}

type RibbonVariant = 'live' | 'hot' | 'new' | 'sold';

function Ribbon({ label, variant }: { label: string; variant: RibbonVariant }) {
  const colors: Record<RibbonVariant, string> = {
    live: 'bg-red-500 text-white',
    hot: 'bg-orange-500 text-white',
    new: 'bg-blue-600 text-white',
    sold: 'bg-slate-500 text-white',
  };
  return (
    <div
      className={cn(
        'absolute right-[-22px] top-[14px] z-10 w-[90px] rotate-[35deg]',
        'py-[3px] text-center text-[9px] font-bold uppercase tracking-[0.08em]',
        colors[variant]
      )}
    >
      {label}
    </div>
  );
}

function Tag({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'cat' | 'type' | 'cond' | 'default';
}) {
  return (
    <span
      className={cn(
        'rounded px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.05em] border',
        variant === 'cat' &&
          'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900/70',
        variant === 'type' &&
          'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700',
        variant === 'cond' &&
          'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-900/70',
        variant === 'default' &&
          'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-500 dark:border-slate-700'
      )}
    >
      {children}
    </span>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col gap-px rounded-lg border border-blue-100 bg-blue-50 px-2 py-1.5 dark:border-blue-900/50 dark:bg-blue-950/50">
      <span className="text-[8.5px] font-semibold uppercase tracking-[0.05em] text-blue-400 dark:text-blue-500">
        {label}
      </span>
      <span className="text-[11px] font-bold tabular-nums text-blue-800 dark:text-blue-300">
        {value}
      </span>
    </div>
  );
}

function TimeBox({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'warn' | 'info' | null;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[9px] border border-slate-100 bg-slate-50 px-2.5 py-1.5 dark:border-slate-800 dark:bg-slate-900/60">
      <span className="text-[9px] font-semibold uppercase tracking-[0.06em] text-slate-400 dark:text-slate-600">
        {label}
      </span>
      <span
        className={cn(
          'text-[11px] font-semibold leading-snug tabular-nums',
          highlight === 'warn' && 'text-red-500 dark:text-red-400',
          highlight === 'info' && 'text-blue-600 dark:text-blue-400',
          !highlight && 'text-slate-800 dark:text-slate-200'
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Cover overlay widgets ────────────────────────────────────────────────────

function CoverCounter({ count, isLive }: { count: number; isLive: boolean }) {
  return (
    <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/60 px-2 py-1 backdrop-blur-md">
      {isLive ? (
        <TrendingUp className="size-3 text-blue-300" aria-hidden />
      ) : (
        <Eye className="size-3 text-blue-300" aria-hidden />
      )}
      <span className="text-[11px] font-bold tabular-nums text-white">
        {count}
      </span>
      <span className="text-[9px] text-white/55">
        {isLive ? 'bids' : 'watching'}
      </span>
    </div>
  );
}

// ─── Unique per-status content panels ────────────────────────────────────────

/** LIVE: animated current-bid ticker with % above start */
function BidTicker({
  currentBid,
  startPrice,
}: {
  currentBid: number;
  startPrice: number;
}) {
  const pct =
    startPrice > 0
      ? Math.round(((currentBid - startPrice) / startPrice) * 100)
      : 0;

  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 dark:border-blue-900/50 dark:bg-blue-950/60">
      <TrendingUp
        className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400"
        aria-hidden
      />
      <div className="flex flex-col">
        <span className="text-[9px] font-semibold uppercase tracking-[0.06em] text-blue-500">
          Current Bid
        </span>
        <span className="text-[14px] font-bold tabular-nums text-blue-900 dark:text-blue-200">
          {formatAuctionPrice(currentBid)}
        </span>
      </div>
      {pct > 0 && (
        <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          +{pct}%
        </span>
      )}
    </div>
  );
}

/** UPCOMING: interest/time progress bar */
function InterestBar({
  percent,
  opensIn,
}: {
  percent: number;
  opensIn: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-[9.5px] font-medium text-slate-500 dark:text-slate-500">
        <span>{opensIn}</span>
        <span>{percent}% interest</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}

/** ENDED: final price stamp */
function FinalPriceBadge({ finalPrice }: { finalPrice: number }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/60">
      <CheckCircle2 className="size-3.5 shrink-0 text-slate-400" aria-hidden />
      <div className="flex flex-col">
        <span className="text-[9px] font-semibold uppercase tracking-[0.06em] text-slate-400">
          Final Price
        </span>
        <span className="text-[14px] font-bold tabular-nums text-slate-600 dark:text-slate-300">
          {formatAuctionPrice(finalPrice)}
        </span>
      </div>
    </div>
  );
}

// ─── Icon button helper ───────────────────────────────────────────────────────

function IconBtn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-[10px]',
        'border border-slate-200 bg-slate-50 text-slate-500',
        'transition-[border-color,background,color] duration-150',
        'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600',
        'dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500',
        'dark:hover:border-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-400'
      )}
    >
      {children}
    </button>
  );
}

// ─── AuctionCard ──────────────────────────────────────────────────────────────

export function AuctionCard({
  auction,
  href = `/auction/${auction.id}`,
  className,
  bidCount,
  watcherCount,
  interestPercent = 42,
  currentBid,
  ribbonLabel,
}: AuctionCardProps) {
  const asset0 = auction.assets?.[0];
  const url = getAuctionAssetUrl(asset0?.fileKey);
  const showImage = Boolean(url) && asset0?.assetType !== 'VIDEO';

  const isLive = auction.status === 'LIVE';
  const isUpcoming = auction.status === 'UPCOMING';
  const isEnded = auction.status === 'ENDED';

  const resolvedRibbon =
    ribbonLabel ?? (isLive ? 'Hot' : isUpcoming ? 'New' : 'Sold');
  const ribbonVariant: RibbonVariant = isLive
    ? 'hot'
    : isUpcoming
      ? 'new'
      : 'sold';

  const displayCount = bidCount ?? (isLive ? 0 : (watcherCount ?? 0));

  const topBorder = isLive
    ? 'border-t-red-500'
    : isUpcoming
      ? 'border-t-blue-600'
      : 'border-t-slate-300 dark:border-t-slate-700';

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[18px]',
        'border border-slate-200 bg-white',
        'dark:border-slate-800 dark:bg-[#0d1526]',
        'transition-[border-color,transform] duration-200',
        'hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700',
        'border-t-[2.5px]',
        topBorder,
        isEnded && 'opacity-75',
        className
      )}
    >
      {/* ── Cover ── */}
      <Link
        href={href}
        className="relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label={`Open: ${auction.title}`}
        tabIndex={isEnded ? -1 : undefined}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          {showImage ? (
            <AuctionCardCover
              title={auction.title}
              imageUrl={url}
              showImage
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-blue-950">
              <svg
                className="opacity-[0.12]"
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
          )}

          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Ribbon (overflow hidden on parent clips it) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <Ribbon label={resolvedRibbon} variant={ribbonVariant} />
          </div>

          {/* Status pill */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <StatusPill status={auction.status} />
          </div>

          {/* Bid / watcher counter */}
          {displayCount > 0 && (
            <CoverCounter count={displayCount} isLive={isLive} />
          )}
        </div>
      </Link>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col gap-2.5 px-3.5 pb-0 pt-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Tag variant="cat">{auction.category.name}</Tag>
          <Tag variant="type">{auction.auctionType}</Tag>
          <Tag variant="cond">{auction.condition}</Tag>
        </div>

        {/* Title */}
        <Link
          href={href}
          className="block rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <h3 className="line-clamp-2   text-[16px] leading-[1.4] text-slate-900 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-400">
            {auction.title}
          </h3>
        </Link>

        {/* Unique per-status panel */}
        {isLive && (
          <BidTicker
            currentBid={currentBid ?? auction.startPrice}
            startPrice={auction.startPrice}
          />
        )}
        {isUpcoming && (
          <InterestBar percent={interestPercent} opensIn="Opens in 5 days" />
        )}
        {isEnded && (
          <FinalPriceBadge finalPrice={currentBid ?? auction.startPrice} />
        )}

        {/* Time grid */}
        <div className="grid grid-cols-2 gap-1.5">
          <TimeBox
            label={isUpcoming ? 'Starts' : 'Started'}
            value={formatAuctionDateTime(auction.startAt)}
            highlight={isUpcoming ? 'info' : null}
          />
          <TimeBox
            label={isLive ? 'Ends' : 'Ended'}
            value={formatAuctionDateTime(auction.endAt)}
            highlight={isLive ? 'warn' : null}
          />
        </div>

        {/* Stats strip */}
        <div className="flex gap-1.5">
          <StatChip
            label="Min Bid"
            value={formatAuctionPrice(auction.minIncrement)}
          />
          <StatChip label="Anti-Snipe" value={`${auction.antiSnipSeconds}s`} />
          <StatChip
            label={auction.maxExtensionCount > 0 ? 'Max Ext.' : 'Cooldown'}
            value={
              auction.maxExtensionCount > 0
                ? `${auction.maxExtensionCount}×`
                : `${auction.bidCooldownSeconds}s`
            }
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-auto flex items-center gap-2 p-3">
        {isLive && (
          <>
            <Link
              href={href}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-[10px]',
                'bg-blue-600 px-3 py-2.5 text-[12px] font-bold tracking-wide text-white',
                'outline-none transition-[background,transform] duration-150',
                'hover:bg-blue-700 active:scale-[0.97]',
                'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
              )}
            >
              Place Bid
              <ArrowRight className="size-3" aria-hidden />
            </Link>
            <IconBtn label="Watch auction">
              <Heart className="size-3.5" aria-hidden />
            </IconBtn>
            <IconBtn label="Share auction">
              <Share2 className="size-3.5" aria-hidden />
            </IconBtn>
          </>
        )}

        {isUpcoming && (
          <>
            <button
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-[10px]',
                'border border-blue-200 bg-blue-50 px-3 py-2.5',
                'text-[12px] font-bold tracking-wide text-blue-700',
                'transition-[background,border-color] duration-150',
                'hover:bg-blue-100 active:scale-[0.97]',
                'dark:border-blue-900/50 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-950'
              )}
            >
              <Bell className="size-3" aria-hidden />
              Set Reminder
            </button>
            <IconBtn label="Watch auction">
              <Heart className="size-3.5" aria-hidden />
            </IconBtn>
          </>
        )}

        {isEnded && (
          <span
            className={cn(
              'flex flex-1 cursor-not-allowed items-center justify-center rounded-[10px]',
              'bg-slate-100 px-3 py-2.5 text-[12px] font-bold text-slate-400',
              'dark:bg-slate-900 dark:text-slate-600'
            )}
          >
            Auction Closed
          </span>
        )}
      </div>
    </div>
  );
}
