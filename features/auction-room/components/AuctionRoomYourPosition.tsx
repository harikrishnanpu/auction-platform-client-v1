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
    title: "You're winning",
    subtitle: 'Your bid is the highest so far.',
    className:
      'border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-950 dark:text-emerald-100',
    icon: Trophy,
  },
  outbid: {
    title: "You're outbid",
    subtitle: 'Place a higher bid to take the lead.',
    className:
      'border-amber-500/25 bg-amber-500/[0.07] text-amber-950 dark:text-amber-100',
    icon: CircleDot,
  },
  watching: {
    title: 'Watching',
    subtitle: 'Others are bidding — join in when you are ready.',
    className: 'border-border/60 bg-muted/30 text-foreground',
    icon: Sparkles,
  },
  no_bids_yet: {
    title: 'No bids yet',
    subtitle: 'Be the first to bid when the room is open.',
    className: 'border-border/60 bg-muted/30 text-foreground',
    icon: Sparkles,
  },
  sealed_invite: {
    title: 'Sealed auction',
    subtitle: 'Place your bid — amounts stay hidden until the end.',
    className:
      'border-sky-500/20 bg-sky-500/[0.06] text-sky-950 dark:text-sky-100',
    icon: Lock,
  },
  sealed_placed: {
    title: 'Bid received',
    subtitle: 'Your sealed bid is in. Good luck.',
    className:
      'border-sky-500/20 bg-sky-500/[0.06] text-sky-950 dark:text-sky-100',
    icon: Lock,
  },
  live_soon: {
    title: 'Live format',
    subtitle: 'Real-time bidding will run here when enabled.',
    className:
      'border-violet-500/20 bg-violet-500/[0.06] text-violet-950 dark:text-violet-100',
    icon: Video,
  },
  need_join: {
    title: 'Join to bid',
    subtitle: 'Complete the deposit step to unlock bidding.',
    className: 'border-border/60 bg-muted/30 text-foreground',
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
      className={cn('rounded-xl border px-2.5 py-2', tone, className)}
    >
      <div className="flex gap-2">
        <span className="mt-px flex size-7 shrink-0 items-center justify-center rounded-lg bg-background/50">
          <Icon className="size-3.5 opacity-90" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-tight">{title}</p>
          <p className="mt-0.5 text-[10px] leading-snug text-foreground/75">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
