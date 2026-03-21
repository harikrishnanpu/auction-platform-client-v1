'use client';

import { Loader2, Wifi, WifiOff } from 'lucide-react';

import { cn } from '@/lib/utils';

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

type AuctionRoomConnectionStatusProps = {
  state: ConnectionState;
  className?: string;
};

const copy: Record<ConnectionState, string> = {
  connecting: 'Connecting…',
  connected: 'Live',
  disconnected: 'Offline',
  error: 'Connection issue',
};

export function AuctionRoomConnectionStatus({
  state,
  className,
}: AuctionRoomConnectionStatusProps) {
  const Icon =
    state === 'connected' ? Wifi : state === 'connecting' ? Loader2 : WifiOff;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        state === 'connected' &&
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        state === 'connecting' &&
          'border-border bg-muted/50 text-muted-foreground',
        (state === 'disconnected' || state === 'error') &&
          'border-destructive/25 bg-destructive/10 text-destructive',
        className
      )}
    >
      <Icon
        className={cn('size-3.5', state === 'connecting' && 'animate-spin')}
        aria-hidden
      />
      {copy[state]}
    </span>
  );
}
