import type { LucideIcon } from 'lucide-react';
import {
  CircleSlash,
  Crown,
  Flame,
  Gavel,
  Handshake,
  Timer,
  Trophy,
  TrendingDown,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { IUserHomeStats } from '../types/home.types';

type Accent =
  | 'red'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'violet'
  | 'orange'
  | 'teal'
  | 'slate';

interface StatConfig {
  key: keyof IUserHomeStats;
  label: string;
  icon: LucideIcon;
  accent: Accent;
}

const MARKET_STATS: StatConfig[] = [
  { key: 'liveCount', label: 'Live', icon: Flame, accent: 'red' },
  { key: 'upcomingCount', label: 'Soon', icon: Timer, accent: 'blue' },
  { key: 'endedCount', label: 'Closed', icon: Gavel, accent: 'emerald' },
  {
    key: 'participatedCount',
    label: 'Joined',
    icon: Handshake,
    accent: 'amber',
  },
];

const POSITION_STATS: StatConfig[] = [
  {
    key: 'liveWinningCount',
    label: 'Leading',
    icon: Crown,
    accent: 'violet',
  },
  {
    key: 'liveLosingCount',
    label: 'Outbid',
    icon: TrendingDown,
    accent: 'orange',
  },
  { key: 'wonCount', label: 'Won', icon: Trophy, accent: 'teal' },
  {
    key: 'lostCount',
    label: 'Lost',
    icon: CircleSlash,
    accent: 'slate',
  },
];

const ACCENT_DOT: Record<Accent, string> = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  violet: 'bg-violet-500',
  orange: 'bg-orange-500',
  teal: 'bg-teal-500',
  slate: 'bg-slate-400 dark:bg-slate-500',
};

export interface HomeStatsProps {
  stats: IUserHomeStats;
  className?: string;
  variant?: 'dashboard' | 'inline';
}

function StatChip({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: Accent;
}) {
  return (
    <div
      className={cn(
        'flex min-w-19 shrink-0 flex-col gap-1 rounded-lg border border-border/70 bg-muted/25 px-2.5 py-2 sm:min-w-0 sm:flex-1 sm:px-3'
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn('size-1.5 shrink-0 rounded-full', ACCENT_DOT[accent])}
          aria-hidden
        />
        <Icon className="size-3 shrink-0 text-muted-foreground" aria-hidden />
        <span className="truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="pl-0 text-lg font-semibold tabular-nums leading-none tracking-tight text-foreground sm:text-xl">
        {value}
      </p>
    </div>
  );
}

export function HomeStats({
  stats,
  className,
  variant = 'dashboard',
}: HomeStatsProps) {
  if (variant === 'inline') {
    return (
      <section
        className={cn(
          'flex flex-wrap gap-2 sm:grid sm:grid-cols-4 sm:gap-2 lg:grid-cols-8',
          className
        )}
      >
        {[...MARKET_STATS, ...POSITION_STATS].map((item) => (
          <StatChip
            key={item.key}
            label={item.label}
            value={stats[item.key] ?? 0}
            icon={item.icon}
            accent={item.accent}
          />
        ))}
      </section>
    );
  }

  return (
    <section className={cn('w-full', className)} aria-label="Your stats">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        At a glance
      </p>
      <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:overflow-visible">
        <div className="flex min-w-min snap-x snap-mandatory gap-2 pb-0.5 sm:min-w-0 sm:flex-wrap sm:gap-2">
          {MARKET_STATS.map((item) => (
            <div key={item.key} className="snap-start">
              <StatChip
                label={item.label}
                value={stats[item.key] ?? 0}
                icon={item.icon}
                accent={item.accent}
              />
            </div>
          ))}
          <div
            className="hidden h-auto w-px shrink-0 self-stretch bg-border/80 sm:block"
            aria-hidden
          />
          {POSITION_STATS.map((item) => (
            <div key={item.key} className="snap-start">
              <StatChip
                label={item.label}
                value={stats[item.key] ?? 0}
                icon={item.icon}
                accent={item.accent}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
