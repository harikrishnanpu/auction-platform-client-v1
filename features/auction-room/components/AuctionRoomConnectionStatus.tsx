'use client';

import { Loader2, Wifi, WifiOff } from 'lucide-react';

import { cn } from '@/lib/utils';

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

type AuctionRoomConnectionStatusProps = {
  state: ConnectionState;
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
      ? 'Connecting'
      : syncing
        ? 'Syncing'
        : state === 'connected'
          ? 'Connected'
          : state === 'disconnected'
            ? 'Offline'
            : 'Issue';

  const Icon =
    state === 'connected' && roomReady
      ? Wifi
      : state === 'connecting' || syncing
        ? Loader2
        : WifiOff;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#374151] shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
        'dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300',
        state === 'connected' &&
          roomReady &&
          'border-emerald-500/30 bg-emerald-500/[0.07] text-[#059669]',
        (state === 'connecting' || syncing) &&
          'border-[#e5e7eb] bg-[#f8f9fa] text-[#6b7280]',
        (state === 'disconnected' || state === 'error') &&
          'border-red-200 bg-red-50 text-[#b91c1c] dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300',
        className
      )}
    >
      <Icon
        className={cn(
          'size-3.5 shrink-0',
          (state === 'connecting' || syncing) && 'animate-spin'
        )}
        aria-hidden
      />
      {label}
    </span>
  );
}
