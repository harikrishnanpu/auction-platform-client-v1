'use client';

import { useMemo, useState } from 'react';
import { Bot, Clock3, Gauge, Lock, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formatAuctionPrice } from '@/utils/auction-utils';
import type { IAuctionRoomAutoBidConfig } from '@/types/auctionRoom.types';

import {
  arBtnPrimary,
  arBtnSecondary,
  arType,
} from '../lib/auction-room-design';

import { AuctionRoomStatTile } from './AuctionRoomStatTile';

const STRATEGY_OPTIONS: Array<{
  value: 'SLOW' | 'FASTER' | 'SNIPER';
  label: string;
  hint: string;
}> = [
  {
    value: 'SLOW',
    label: 'Slow',
    hint: 'Places the minimum valid counter bid.',
  },
  {
    value: 'FASTER',
    label: 'Faster',
    hint: 'Jumps one increment above minimum.',
  },
  {
    value: 'SNIPER',
    label: 'Sniper',
    hint: 'Bids only in the final 30 seconds.',
  },
];

const glassInset = cn(
  'rounded-[10px] border border-white/35 bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]',
  'backdrop-blur-md dark:border-white/12 dark:bg-white/6 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
);

type AuctionRoomAutoBidPanelProps = {
  config: IAuctionRoomAutoBidConfig | null;
  nextBidMin: number | null;
  canInteract: boolean;
  isAuctionActive: boolean;
  isLiveAuction?: boolean;
  onEnable(input: {
    strategy: 'SLOW' | 'FASTER' | 'SNIPER';
    maxBidAmount: number;
  }): Promise<{ success: boolean; error?: string }>;
  onDisable(): Promise<{ success: boolean; error?: string }>;
};

export function AuctionRoomAutoBidPanel({
  config,
  nextBidMin,
  canInteract,
  isAuctionActive,
  isLiveAuction = false,
  onEnable,
  onDisable,
}: AuctionRoomAutoBidPanelProps) {
  const [strategy, setStrategy] = useState<'SLOW' | 'FASTER' | 'SNIPER'>(
    config?.strategy ?? 'SLOW'
  );
  const [maxBid, setMaxBid] = useState<string>(
    config?.maxBidAmount != null ? String(config.maxBidAmount) : ''
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedMeta = useMemo(
    () => STRATEGY_OPTIONS.find((x) => x.value === strategy),
    [strategy]
  );

  const autoBidLocked = isLiveAuction;
  const disabled = autoBidLocked || !canInteract || !isAuctionActive || busy;

  async function handleEnable() {
    const maxBidAmount = Number(maxBid);
    if (!Number.isFinite(maxBidAmount) || maxBidAmount <= 0) {
      setError('Enter a valid max bid amount');
      return;
    }
    if (nextBidMin != null && maxBidAmount < nextBidMin) {
      setError(`Max bid must be at least ${formatAuctionPrice(nextBidMin)}`);
      return;
    }

    setBusy(true);
    setError(null);
    const res = await onEnable({ strategy, maxBidAmount });
    setBusy(false);
    if (!res.success) {
      setError(res.error ?? 'Could not enable auto bid');
    }
  }

  async function handleDisable() {
    setBusy(true);
    setError(null);
    const res = await onDisable();
    setBusy(false);
    if (!res.success) {
      setError(res.error ?? 'Could not disable auto bid');
    }
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[14px]',
        'border border-white/45 shadow-[0_12px_48px_rgba(0,0,0,0.1)]',
        'bg-linear-to-br from-white/60 via-white/35 to-white/25',
        'backdrop-blur-2xl backdrop-saturate-175',
        'ring-1 ring-inset ring-white/50',
        'dark:border-white/14 dark:from-zinc-900/55 dark:via-zinc-950/45 dark:to-zinc-950/30',
        'dark:shadow-[0_12px_48px_rgba(0,0,0,0.45)] dark:ring-white/10',
        autoBidLocked && 'ring-amber-400/25 dark:ring-amber-400/20'
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55] dark:opacity-40"
        style={{
          background:
            'radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.45) 0%, transparent 55%), radial-gradient(90% 70% at 100% 100%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }}
        aria-hidden
      />

      <div className="relative z-1 flex flex-col">
        {autoBidLocked ? (
          <div
            className={cn(
              'flex items-start gap-3 border-b border-white/35 px-3 py-3',
              'bg-white/25 backdrop-blur-md dark:border-white/10 dark:bg-white/5'
            )}
          >
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                'border border-white/50 bg-white/45 shadow-sm backdrop-blur-sm',
                'text-amber-700 dark:border-white/15 dark:bg-white/10 dark:text-amber-400'
              )}
            >
              <Lock className="size-[18px]" strokeWidth={2.25} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="text-xs font-semibold tracking-tight text-foreground">
                Auto bid locked for live auction
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                Open a long auction room to enable auto bidding controls.
              </p>
            </div>
          </div>
        ) : null}

        <div className="relative z-1 border-b border-white/25 px-3 py-2.5 dark:border-white/8">
          <h3 className={arType.cardTitle}>Controls</h3>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
            Strategy and max ceiling for automated bids.
          </p>
        </div>

        <div className="relative z-1 space-y-2 px-3 py-2.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <AuctionRoomStatTile label="Status" icon={<Bot />}>
              <span className="text-[11px] font-semibold leading-tight">
                {autoBidLocked
                  ? 'Locked'
                  : config?.isActive
                    ? 'Enabled'
                    : 'Off'}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Mode" icon={<Gauge />}>
              <span className="text-[11px] font-semibold leading-tight">
                {config?.strategy ?? strategy}
              </span>
            </AuctionRoomStatTile>
            <AuctionRoomStatTile label="Next min" icon={<Target />}>
              <span className="text-[11px] font-semibold leading-tight tabular-nums">
                {nextBidMin != null ? formatAuctionPrice(nextBidMin) : '—'}
              </span>
            </AuctionRoomStatTile>
          </div>

          <div
            className={cn(
              'relative rounded-[10px]',
              autoBidLocked &&
                'after:pointer-events-none after:absolute after:inset-0 after:rounded-[10px] after:bg-white/10 after:backdrop-blur-[2px] dark:after:bg-black/20'
            )}
          >
            {config?.isActive ? (
              <div className={cn(glassInset, 'space-y-4 p-4')}>
                <p className="text-sm leading-relaxed text-foreground/90">
                  Running with max{' '}
                  <span className="font-semibold text-foreground">
                    {formatAuctionPrice(config.maxBidAmount)}
                  </span>{' '}
                  · strategy{' '}
                  <span className="font-semibold text-foreground">
                    {config.strategy}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(arBtnSecondary('w-full'), 'h-11')}
                  disabled={disabled}
                  onClick={() => void handleDisable()}
                >
                  Disable auto bid
                </Button>
              </div>
            ) : (
              <div className={cn(glassInset, 'space-y-4 p-4')}>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Strategy
                  </Label>
                  <Select
                    value={strategy}
                    onValueChange={(value) =>
                      setStrategy(value as 'SLOW' | 'FASTER' | 'SNIPER')
                    }
                  >
                    <SelectTrigger
                      className="h-11 rounded-[8px] border-white/40 bg-white/30 text-sm backdrop-blur-sm dark:border-white/15 dark:bg-white/10"
                      disabled={disabled}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STRATEGY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedMeta ? (
                    <p className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Clock3 className="mt-0.5 size-4 shrink-0" />
                      {selectedMeta.hint}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-foreground">
                    Max bid
                  </Label>
                  <Input
                    value={maxBid}
                    onChange={(e) => setMaxBid(e.target.value)}
                    inputMode="decimal"
                    placeholder="Enter max amount"
                    className="h-11 rounded-[8px] border-white/40 bg-white/30 text-sm backdrop-blur-sm placeholder:text-muted-foreground dark:border-white/15 dark:bg-white/10"
                    disabled={disabled}
                  />
                </div>

                <Button
                  type="button"
                  className={arBtnPrimary('w-full')}
                  disabled={disabled}
                  onClick={() => void handleEnable()}
                >
                  Enable auto bid
                </Button>
              </div>
            )}
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
