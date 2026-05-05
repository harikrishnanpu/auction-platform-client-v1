'use client';

import { useMemo, useState } from 'react';
import { Bot, Clock3, Gauge, Target } from 'lucide-react';

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
import { formatAuctionPrice } from '@/utils/auction-utils';
import type { IAuctionRoomAutoBidConfig } from '@/types/auctionRoom.types';

import { AuctionRoomSectionCard } from './AuctionRoomSectionCard';
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

type AuctionRoomAutoBidPanelProps = {
  config: IAuctionRoomAutoBidConfig | null;
  nextBidMin: number | null;
  canInteract: boolean;
  isAuctionActive: boolean;
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

  const disabled = !canInteract || !isAuctionActive || busy;

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
    <AuctionRoomSectionCard
      title="Auto bid"
      description="Let the room place bids for you with a simple strategy."
    >
      <div className="grid grid-cols-3 gap-1.5">
        <AuctionRoomStatTile label="Status" icon={<Bot />}>
          {config?.isActive ? 'Enabled' : 'Off'}
        </AuctionRoomStatTile>
        <AuctionRoomStatTile label="Mode" icon={<Gauge />}>
          {config?.strategy ?? strategy}
        </AuctionRoomStatTile>
        <AuctionRoomStatTile label="Next min" icon={<Target />}>
          {nextBidMin != null ? formatAuctionPrice(nextBidMin) : '—'}
        </AuctionRoomStatTile>
      </div>

      {config?.isActive ? (
        <div className="space-y-2 rounded-lg border border-border/40 bg-background/40 p-2">
          <p className="text-[10px] text-muted-foreground">
            Active with max bid{' '}
            <span className="font-semibold text-foreground">
              {formatAuctionPrice(config.maxBidAmount)}
            </span>
            . Strategy:{' '}
            <span className="font-semibold text-foreground">
              {config.strategy}
            </span>
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 w-full rounded-lg text-[11px]"
            disabled={disabled}
            onClick={() => void handleDisable()}
          >
            Disable auto bid
          </Button>
        </div>
      ) : (
        <div className="space-y-2 rounded-lg border border-border/40 bg-background/40 p-2">
          <div className="space-y-1">
            <Label className="text-[10px]">Strategy</Label>
            <Select
              value={strategy}
              onValueChange={(value) =>
                setStrategy(value as 'SLOW' | 'FASTER' | 'SNIPER')
              }
            >
              <SelectTrigger className="h-8 rounded-lg text-xs">
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
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock3 className="size-3" />
                {selectedMeta.hint}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label className="text-[10px]">Max bid</Label>
            <Input
              value={maxBid}
              onChange={(e) => setMaxBid(e.target.value)}
              inputMode="decimal"
              placeholder="Enter max amount"
              className="h-8 rounded-lg text-xs"
              disabled={disabled}
            />
          </div>

          <Button
            type="button"
            size="sm"
            className="h-8 w-full rounded-lg text-[11px]"
            disabled={disabled}
            onClick={() => void handleEnable()}
          >
            Enable auto bid
          </Button>
        </div>
      )}

      {error ? <p className="text-[10px] text-destructive">{error}</p> : null}
    </AuctionRoomSectionCard>
  );
}
