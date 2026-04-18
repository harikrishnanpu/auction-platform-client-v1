import type { LucideIcon } from 'lucide-react';
import { Flame, Gavel, Handshake, Timer } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { IUserHomeStats } from '../types/home.types';

type Accent = 'red' | 'blue' | 'emerald' | 'amber';

interface StatConfig {
  key: keyof IUserHomeStats;
  label: string;
  icon: LucideIcon;
  accent: Accent;
}

const STAT_ITEMS: StatConfig[] = [
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
};

export interface HomeStatsProps {
  stats: IUserHomeStats;
  className?: string;
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
        'group flex items-center gap-2.5 rounded-lg border border-border/70 bg-card px-3 py-2.5 transition-colors',
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

export function HomeStats({ stats, className }: HomeStatsProps) {
  return (
    <section
      className={cn(
        'grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3',
        className
      )}
    >
      {STAT_ITEMS.map((item) => (
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
