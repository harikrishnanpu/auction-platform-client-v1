import type { IAuctionDto, AuctionStatus } from '@/types/auction.type';
import { auctionStatusLabel } from '@/utils/auction-utils';

export type AuctionCardStatusAccent = { border: string; badge: string };

/** Ribbon variants used by `AuctionCard` cover ribbon */
export type AuctionCardRibbonVariant =
  | 'hot'
  | 'new'
  | 'sold'
  | 'draft'
  | 'ended'
  | 'cancelled'
  | 'offer'
  | 'fallback';

/** Status pill visual style + label (derived from API status + schedule) */
export type AuctionCardStatusPillKind =
  | 'live'
  | 'upcoming'
  | 'draft'
  | 'cancelled'
  | 'ended'
  | 'sold'
  | 'fallback_ended'
  | 'public_offer'
  | 'paused'
  | 'unknown';

export type AuctionCardDisplay = {
  ribbonLabel: string;
  ribbonVariant: AuctionCardRibbonVariant;
  statusPillKind: AuctionCardStatusPillKind;
  /** Active bidding window — bid ticker + place bid */
  isLive: boolean;
  /** Before start — interest bar */
  isUpcoming: boolean;
  isDraft: boolean;
  isCancelled: boolean;
  isSold: boolean;
  /** Muted card, no bidding CTA */
  isClosed: boolean;
  /** Show final price row (ended / sold / offer / stale published) */
  showFinalPriceRow: boolean;
};

const ACCENT: Record<AuctionStatus, AuctionCardStatusAccent> = {
  PUBLISHED: {
    border: 'border-l-emerald-500',
    badge:
      'border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300',
  },
  ACTIVE: {
    border: 'border-l-emerald-500',
    badge:
      'border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300',
  },
  DRAFT: {
    border: 'border-l-amber-500',
    badge:
      'border-amber-500/25 bg-amber-500/[0.08] text-amber-800 dark:text-amber-200',
  },
  LIVE: {
    border: 'border-l-emerald-500',
    badge:
      'border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300',
  },
  UPCOMING: {
    border: 'border-l-blue-500',
    badge:
      'border-blue-500/25 bg-blue-500/[0.08] text-blue-800 dark:text-blue-200',
  },
  SOLD: {
    border: 'border-l-emerald-600',
    badge:
      'border-emerald-600/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
  },
  ENDED: {
    border: 'border-l-slate-500',
    badge: 'border-border bg-muted/50 text-muted-foreground',
  },
  CANCELLED: {
    border: 'border-l-destructive',
    badge: 'border-destructive/25 bg-destructive/10 text-destructive',
  },
  FALLBACK_ENDED: {
    border: 'border-l-slate-500',
    badge: 'border-border bg-muted/50 text-muted-foreground',
  },
  FALLBACK_PUBLIC_NOTIFICATION: {
    border: 'border-l-sky-500',
    badge: 'border-sky-500/25 bg-sky-500/[0.08] text-sky-800 dark:text-sky-200',
  },
  PAUSED: {
    border: 'border-l-orange-500',
    badge:
      'border-orange-500/25 bg-orange-500/[0.08] text-orange-900 dark:text-orange-200',
  },
};

const FALLBACK: AuctionCardStatusAccent = {
  border: 'border-l-muted-foreground/40',
  badge: 'border-border bg-muted/40 text-muted-foreground',
};

export function getAuctionCardStatusAccent(
  status: AuctionStatus
): AuctionCardStatusAccent {
  return ACCENT[status] ?? FALLBACK;
}

function normStatus(raw: string): string {
  return raw.trim().toUpperCase();
}

function parseSchedule(auction: IAuctionDto): {
  now: number;
  start: number;
  end: number;
  ok: boolean;
} {
  const now = Date.now();
  const start = new Date(auction.startAt as unknown as string).getTime();
  const end = new Date(auction.endAt as unknown as string).getTime();
  const ok = Number.isFinite(start) && Number.isFinite(end);
  return { now, start, end, ok };
}

/**
 * Derives ribbon, pill, and section visibility from `auction.status` and start/end dates.
 * Fixes mismatches where the UI assumed `LIVE` / `UPCOMING` / `ENDED` only, which mapped
 * drafts and published listings to the wrong “Ended / Sold” defaults.
 */
export function getAuctionCardDisplay(
  auction: IAuctionDto
): AuctionCardDisplay {
  const status = normStatus(String(auction.status));
  const { now, start, end, ok } = parseSchedule(auction);

  const beforeStart = ok && now < start;
  const inWindow = ok && now >= start && now < end;
  const afterEnd = ok && now >= end;

  if (status === 'DRAFT') {
    return {
      ribbonLabel: 'Draft',
      ribbonVariant: 'draft',
      statusPillKind: 'draft',
      isLive: false,
      isUpcoming: false,
      isDraft: true,
      isCancelled: false,
      isSold: false,
      isClosed: false,
      showFinalPriceRow: false,
    };
  }

  if (status === 'CANCELLED') {
    return {
      ribbonLabel: 'Off',
      ribbonVariant: 'cancelled',
      statusPillKind: 'cancelled',
      isLive: false,
      isUpcoming: false,
      isDraft: false,
      isCancelled: true,
      isSold: false,
      isClosed: true,
      showFinalPriceRow: false,
    };
  }

  if (status === 'SOLD') {
    return {
      ribbonLabel: 'Sold',
      ribbonVariant: 'sold',
      statusPillKind: 'sold',
      isLive: false,
      isUpcoming: false,
      isDraft: false,
      isCancelled: false,
      isSold: true,
      isClosed: true,
      showFinalPriceRow: true,
    };
  }

  if (status === 'ENDED') {
    return {
      ribbonLabel: 'Ended',
      ribbonVariant: 'ended',
      statusPillKind: 'ended',
      isLive: false,
      isUpcoming: false,
      isDraft: false,
      isCancelled: false,
      isSold: false,
      isClosed: true,
      showFinalPriceRow: true,
    };
  }

  if (status === 'FALLBACK_ENDED') {
    return {
      ribbonLabel: 'Fallback',
      ribbonVariant: 'fallback',
      statusPillKind: 'fallback_ended',
      isLive: false,
      isUpcoming: false,
      isDraft: false,
      isCancelled: false,
      isSold: false,
      isClosed: true,
      showFinalPriceRow: true,
    };
  }

  if (status === 'FALLBACK_PUBLIC_NOTIFICATION') {
    return {
      ribbonLabel: 'Offer',
      ribbonVariant: 'offer',
      statusPillKind: 'public_offer',
      isLive: false,
      isUpcoming: false,
      isDraft: false,
      isCancelled: false,
      isSold: false,
      isClosed: true,
      showFinalPriceRow: true,
    };
  }

  // Explicit API schedule statuses
  if (status === 'LIVE') {
    return {
      ribbonLabel: 'Hot',
      ribbonVariant: 'hot',
      statusPillKind: 'live',
      isLive: true,
      isUpcoming: false,
      isDraft: false,
      isCancelled: false,
      isSold: false,
      isClosed: false,
      showFinalPriceRow: false,
    };
  }

  if (status === 'UPCOMING') {
    return {
      ribbonLabel: 'New',
      ribbonVariant: 'new',
      statusPillKind: 'upcoming',
      isLive: false,
      isUpcoming: true,
      isDraft: false,
      isCancelled: false,
      isSold: false,
      isClosed: false,
      showFinalPriceRow: false,
    };
  }

  if (status === 'PAUSED') {
    return {
      ribbonLabel: 'Paused',
      ribbonVariant: 'ended',
      statusPillKind: 'paused',
      isLive: false,
      isUpcoming: false,
      isDraft: false,
      isCancelled: false,
      isSold: false,
      isClosed: true,
      showFinalPriceRow: false,
    };
  }

  const isPublishedLike = status === 'PUBLISHED' || status === 'ACTIVE';

  if (isPublishedLike) {
    if (beforeStart) {
      return {
        ribbonLabel: 'New',
        ribbonVariant: 'new',
        statusPillKind: 'upcoming',
        isLive: false,
        isUpcoming: true,
        isDraft: false,
        isCancelled: false,
        isSold: false,
        isClosed: false,
        showFinalPriceRow: false,
      };
    }
    if (inWindow) {
      return {
        ribbonLabel: 'Hot',
        ribbonVariant: 'hot',
        statusPillKind: 'live',
        isLive: true,
        isUpcoming: false,
        isDraft: false,
        isCancelled: false,
        isSold: false,
        isClosed: false,
        showFinalPriceRow: false,
      };
    }
    if (afterEnd || !ok) {
      // Stale published or bad dates — show as ended, not sold
      return {
        ribbonLabel: 'Ended',
        ribbonVariant: 'ended',
        statusPillKind: 'ended',
        isLive: false,
        isUpcoming: false,
        isDraft: false,
        isCancelled: false,
        isSold: false,
        isClosed: true,
        showFinalPriceRow: true,
      };
    }
  }

  return {
    ribbonLabel: status || '—',
    ribbonVariant: 'ended',
    statusPillKind: 'unknown',
    isLive: false,
    isUpcoming: false,
    isDraft: false,
    isCancelled: false,
    isSold: false,
    isClosed: true,
    showFinalPriceRow: false,
  };
}

/** Short status line for badge strips — aligned with `getAuctionCardDisplay` / card pill. */
export function getAuctionCardStatusLabel(auction: IAuctionDto): string {
  const d = getAuctionCardDisplay(auction);
  switch (d.statusPillKind) {
    case 'live':
      return 'Live';
    case 'upcoming':
      return 'Upcoming';
    case 'draft':
      return 'Draft';
    case 'cancelled':
      return 'Cancelled';
    case 'ended':
      return 'Ended';
    case 'sold':
      return 'Sold';
    case 'fallback_ended':
      return 'Fallback ended';
    case 'public_offer':
      return 'Public offer';
    case 'paused':
      return 'Paused';
    case 'unknown':
      return auctionStatusLabel(String(auction.status));
  }
}
