'use client';

import { Loader2, Wifi, WifiOff } from 'lucide-react';

import { cn } from '@/lib/utils';

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

type AuctionRoomConnectionStatusProps = {
  state: ConnectionState;
  /** When false and connected, room snapshot has not arrived yet. */
  roomReady?: boolean;
  className?: string;
};

export function AuctionRoomConnectionStatus({
  state,
  roomReady = true,
  className,
}: AuctionRoomConnectionStatusProps) {
  const syncing = state === 'connected' && !roomReady;
  const label =
    state === 'connecting'
      ? 'Connecting…'
      : syncing
        ? 'Syncing…'
        : state === 'connected'
          ? 'Live'
          : state === 'disconnected'
            ? 'Offline'
            : 'Connection issue';

  const Icon =
    state === 'connected' && roomReady
      ? Wifi
      : state === 'connecting' || syncing
        ? Loader2
        : WifiOff;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[8px] font-semibold uppercase tracking-wide',
        state === 'connected' &&
          roomReady &&
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        (state === 'connecting' || syncing) &&
          'border-border bg-muted/50 text-muted-foreground',
        state === 'connected' &&
          !roomReady &&
          'border-sky-500/25 bg-sky-500/10 text-sky-800 dark:text-sky-200',
        (state === 'disconnected' || state === 'error') &&
          'border-destructive/25 bg-destructive/10 text-destructive',
        className
      )}
    >
      <Icon
        className={cn(
          'size-2.5',
          (state === 'connecting' || syncing) && 'animate-spin'
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}
