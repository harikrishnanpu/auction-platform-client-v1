'use client';

import { CircleDot, Lock, Sparkles, Trophy, Video } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { UserBidStanding } from '../utils/auction-room.utils';

type AuctionRoomYourPositionProps = {
  standing: UserBidStanding | null;
  className?: string;
};

const config: Record<
  UserBidStanding,
  { title: string; subtitle: string; className: string; icon: typeof Trophy }
> = {
  winning: {
    title: 'Leading bid',
    subtitle: 'Your offer is currently highest.',
    className:
      'border-emerald-500/25 bg-emerald-500/[0.07] text-[#065f46] dark:text-emerald-100',
    icon: Trophy,
  },
  outbid: {
    title: 'Outbid',
    subtitle: 'Submit a higher bid to regain the lead.',
    className:
      'border-amber-400/35 bg-amber-500/[0.08] text-[#92400e] dark:text-amber-100',
    icon: CircleDot,
  },
  watching: {
    title: 'Watching',
    subtitle: 'Others are bidding — join when you are ready.',
    className: 'border-border/80 bg-muted/40 text-foreground',
    icon: Sparkles,
  },
  no_bids_yet: {
    title: 'Quiet room',
    subtitle: 'No bids yet — you can open when bidding starts.',
    className: 'border-border/80 bg-muted/40 text-foreground',
    icon: Sparkles,
  },
  sealed_invite: {
    title: 'Sealed sale',
    subtitle: 'Amounts stay hidden until the auction closes.',
    className:
      'border-sky-400/30 bg-sky-500/[0.07] text-[#075985] dark:text-sky-100',
    icon: Lock,
  },
  sealed_placed: {
    title: 'Bid locked in',
    subtitle: 'Your sealed bid is recorded.',
    className:
      'border-sky-400/30 bg-sky-500/[0.07] text-[#075985] dark:text-sky-100',
    icon: Lock,
  },
  live_soon: {
    title: 'Live format',
    subtitle: 'Real-time bidding appears here when active.',
    className:
      'border-violet-400/25 bg-violet-500/[0.07] text-[#5b21b6] dark:text-violet-100',
    icon: Video,
  },
  need_join: {
    title: 'Deposit required',
    subtitle: 'Complete the hold to unlock bidding.',
    className: 'border-border/80 bg-muted/40 text-foreground',
    icon: Lock,
  },
};

export function AuctionRoomYourPosition({
  standing,
  className,
}: AuctionRoomYourPositionProps) {
  if (!standing) return null;

  const { title, subtitle, className: tone, icon: Icon } = config[standing];

  return (
    <div
      role="status"
      className={cn(
        'rounded-[12px] border px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        tone,
        className
      )}
    >
      <div className="flex gap-2">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-card/80">
          <Icon className="size-3.5 opacity-90" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-tight">{title}</p>
          <p className="mt-0.5 text-[11px] leading-snug opacity-90">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
