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
  { key: 'liveCount', label: 'Live now', icon: Flame, accent: 'red' },
  { key: 'upcomingCount', label: 'Starting soon', icon: Timer, accent: 'blue' },
  { key: 'endedCount', label: 'Closed', icon: Gavel, accent: 'emerald' },
  {
    key: 'participatedCount',
    label: 'You joined',
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

const ACCENT_STYLES: Record<Accent, { icon: string; ring: string }> = {
  red: {
    icon: 'text-red-500 bg-red-500/10',
    ring: 'group-hover:border-red-300 dark:group-hover:border-red-900/60',
  },
  blue: {
    icon: 'text-blue-500 bg-blue-500/10',
    ring: 'group-hover:border-blue-300 dark:group-hover:border-blue-900/60',
  },
  emerald: {
    icon: 'text-emerald-500 bg-emerald-500/10',
    ring: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-900/60',
  },
  amber: {
    icon: 'text-amber-500 bg-amber-500/10',
    ring: 'group-hover:border-amber-300 dark:group-hover:border-amber-900/60',
  },
  violet: {
    icon: 'text-violet-500 bg-violet-500/10',
    ring: 'group-hover:border-violet-300 dark:group-hover:border-violet-900/60',
  },
  orange: {
    icon: 'text-orange-500 bg-orange-500/10',
    ring: 'group-hover:border-orange-300 dark:group-hover:border-orange-900/60',
  },
  teal: {
    icon: 'text-teal-500 bg-teal-500/10',
    ring: 'group-hover:border-teal-300 dark:group-hover:border-teal-900/60',
  },
  slate: {
    icon: 'text-slate-500 bg-slate-500/10',
    ring: 'group-hover:border-slate-300 dark:group-hover:border-slate-900/60',
  },
};

export interface HomeStatsProps {
  stats: IUserHomeStats;
  className?: string;
  /** Full dashboard: two labeled rows (marketplace + your position). */
  variant?: 'dashboard' | 'inline';
}

function StatCard({
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
  const styles = ACCENT_STYLES[accent];
  return (
    <div
      className={cn(
        'group flex min-w-0 flex-1 items-center gap-2.5 rounded-[8px] border border-border/70 bg-[#f5f5f5] px-3 py-2.5 transition-colors dark:bg-muted/50',
        styles.ring
      )}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-md',
          styles.icon
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xl font-bold tabular-nums leading-none text-foreground">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

function StatGrid({
  items,
  stats,
}: {
  items: StatConfig[];
  stats: IUserHomeStats;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
      {items.map((item) => (
        <StatCard
          key={item.key}
          label={item.label}
          value={stats[item.key] ?? 0}
          icon={item.icon}
          accent={item.accent}
        />
      ))}
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
          'flex flex-wrap gap-2 sm:grid sm:grid-cols-4 sm:gap-3',
          className
        )}
      >
        {[...MARKET_STATS, ...POSITION_STATS].map((item) => (
          <StatCard
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
    <section className={cn('space-y-4', className)}>
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Marketplace
        </p>
        <StatGrid items={MARKET_STATS} stats={stats} />
      </div>
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Your position
        </p>
        <StatGrid items={POSITION_STATS} stats={stats} />
      </div>
    </section>
  );
}
