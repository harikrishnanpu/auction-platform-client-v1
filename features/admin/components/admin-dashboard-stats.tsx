import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  FileCheck,
  Gavel,
  ShieldAlert,
  Store,
  Users,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import type { IAdminDashboardStats } from '@/types/admin-dashboard.type';

type Accent = 'blue' | 'amber' | 'purple' | 'red' | 'emerald' | 'indigo';

interface StatItem {
  key: keyof IAdminDashboardStats;
  label: string;
  icon: LucideIcon;
  accent: Accent;
}

const ITEMS: StatItem[] = [
  { key: 'totalUsers', label: 'Total users', icon: Users, accent: 'blue' },
  {
    key: 'activeSellers',
    label: 'Active sellers',
    icon: Store,
    accent: 'purple',
  },
  { key: 'pendingKyc', label: 'Pending KYC', icon: FileCheck, accent: 'amber' },
  {
    key: 'suspendedUsers',
    label: 'Suspended users',
    icon: ShieldAlert,
    accent: 'red',
  },
  {
    key: 'totalAuctions',
    label: 'Total auctions',
    icon: Gavel,
    accent: 'indigo',
  },
  {
    key: 'liveAuctions',
    label: 'Live auctions',
    icon: Activity,
    accent: 'emerald',
  },
];

const ACCENT_STYLES: Record<Accent, { icon: string; ring: string }> = {
  blue: {
    icon: 'text-blue-500 bg-blue-500/10',
    ring: 'group-hover:border-blue-300 dark:group-hover:border-blue-900/60',
  },
  amber: {
    icon: 'text-amber-500 bg-amber-500/10',
    ring: 'group-hover:border-amber-300 dark:group-hover:border-amber-900/60',
  },
  purple: {
    icon: 'text-purple-500 bg-purple-500/10',
    ring: 'group-hover:border-purple-300 dark:group-hover:border-purple-900/60',
  },
  red: {
    icon: 'text-red-500 bg-red-500/10',
    ring: 'group-hover:border-red-300 dark:group-hover:border-red-900/60',
  },
  emerald: {
    icon: 'text-emerald-500 bg-emerald-500/10',
    ring: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-900/60',
  },
  indigo: {
    icon: 'text-indigo-500 bg-indigo-500/10',
    ring: 'group-hover:border-indigo-300 dark:group-hover:border-indigo-900/60',
  },
};

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
        'group flex items-center gap-3 rounded-lg border border-border/70 bg-card p-4 transition-colors',
        styles.ring
      )}
    >
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-md',
          styles.icon
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-bold tabular-nums leading-none text-foreground">
          {value}
        </p>
        <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

export function AdminDashboardStats({
  stats,
}: {
  stats: IAdminDashboardStats;
}) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ITEMS.map((item) => (
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
