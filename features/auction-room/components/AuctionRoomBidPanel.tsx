'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Gavel, Hourglass } from 'lucide-react';

import { PlaceBidButton } from '@/components/auction/place-bid-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { IAuctionDto } from '@/types/auction.type';
import { formatAuctionPrice } from '@/utils/auction-utils';
import { cn } from '@/lib/utils';

import {
  type PlaceBidFormValues,
  validatePlaceBidAmount,
} from '../schemas/place-bid.schema';
import {
  getAuctionRoomPrimaryBidDisplay,
  getBidPanelHeadline,
  isCountdownLowUrgency,
} from '../utils/auction-room.utils';

type AuctionRoomBidPanelProps = {
  auctionId: string;
  auction: IAuctionDto | null;
  currentBidAmount: number | null;
  bidCount: number;
  isSealedRoom: boolean;
  isLiveRoom: boolean;
  nextBidMin: number | null;
  endCountdown: string | null;
  isAuctionEnded: boolean;
  isAuctionActive: boolean;
  canInteract: boolean;
  showPlaceBid: boolean;
  cooldownRemainingSeconds: number;
  onPlaceBid: (amount: number) => Promise<{ success: boolean; error?: string }>;
};

export function AuctionRoomBidPanel({
  auctionId,
  auction,
  currentBidAmount,
  bidCount,
  isSealedRoom,
  isLiveRoom,
  nextBidMin,
  endCountdown,
  isAuctionEnded,
  isAuctionActive,
  canInteract,
  showPlaceBid,
  cooldownRemainingSeconds,
  onPlaceBid,
}: AuctionRoomBidPanelProps) {
  const inputDisabled = !canInteract || isAuctionEnded || !isAuctionActive;

  const validateAmount = useCallback(
    (value: string) => validatePlaceBidAmount(value, nextBidMin),
    [nextBidMin]
  );

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PlaceBidFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { amount: '' },
  });

  const amountField = register('amount', {
    validate: validateAmount,
  });

  const didInitDefaultRef = useRef(false);

  useEffect(() => {
    didInitDefaultRef.current = false;
  }, [auctionId]);

  useEffect(() => {
    if (!showPlaceBid || nextBidMin == null) return;
    if (didInitDefaultRef.current) return;
    didInitDefaultRef.current = true;
    setValue('amount', String(nextBidMin), {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [auctionId, showPlaceBid, nextBidMin, setValue]);

  useEffect(() => {
    if (!showPlaceBid || nextBidMin == null) return;
    void trigger('amount');
  }, [nextBidMin, showPlaceBid, trigger]);

  const onValidSubmit = async (data: PlaceBidFormValues) => {
    const amount = Number(data.amount.trim());
    const res = await onPlaceBid(amount);
    if (res.success && auction) {
      const nextSuggested = amount + auction.minIncrement;
      setValue('amount', String(nextSuggested), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const headline = getBidPanelHeadline(isLiveRoom, isSealedRoom);
  const primaryDisplay = getAuctionRoomPrimaryBidDisplay(
    isLiveRoom,
    isSealedRoom,
    isAuctionEnded,
    bidCount,
    currentBidAmount
  );

  const submitDisabled =
    inputDisabled || isSubmitting || !isValid || cooldownRemainingSeconds > 0;

  return (
    <Card
      className={cn(
        'rounded-lg border-border/60 shadow-sm',
        'bg-linear-to-br from-card via-card to-amber-500/4 dark:to-amber-400/6'
      )}
    >
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gavel className="size-3.5" aria-hidden />
          </span>
          <div>
            <CardTitle className="text-xs font-semibold tracking-tight">
              {headline.title}
            </CardTitle>
            <CardDescription className="text-[10px] leading-tight">
              {headline.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground sm:text-3xl">
            {primaryDisplay}
          </p>
          {nextBidMin != null ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Minimum start price{' '}
              <span className="font-semibold text-foreground tabular-nums">
                {formatAuctionPrice(auction?.startPrice ?? nextBidMin)}
              </span>
            </p>
          ) : null}
        </div>

        <div className="grid gap-1.5 rounded-lg border border-border/60 bg-background/60 p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Hourglass className="size-3.5 shrink-0" aria-hidden />
              Time left
            </span>
            <span
              className={cn(
                'font-mono text-sm font-semibold tabular-nums',
                isCountdownLowUrgency(endCountdown) &&
                  'text-amber-700 dark:text-amber-400'
              )}
            >
              {isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
            <Badge variant="outline" className="px-1.5 py-0 font-normal">
              Cooldown {auction?.bidCooldownSeconds ?? 0}s
            </Badge>
          </div>
        </div>

        {showPlaceBid ? (
          <form
            className="space-y-1.5"
            onSubmit={handleSubmit(onValidSubmit)}
            noValidate
          >
            <div className="space-y-1">
              <Label htmlFor="place-bid-amount" className="text-xs">
                Your bid
              </Label>
              <Input
                id="place-bid-amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder={
                  nextBidMin != null
                    ? `nextBidMin: ${nextBidMin}`
                    : 'Enter your bid amount'
                }
                disabled={inputDisabled}
                className={cn(
                  'h-9 rounded-md border-border/80 bg-background text-xs tabular-nums',
                  errors.amount && 'border-destructive'
                )}
                {...amountField}
              />
              {errors.amount?.message ? (
                <p className="text-[11px] text-destructive" role="alert">
                  {errors.amount.message}
                </p>
              ) : null}
            </div>
            <PlaceBidButton
              type="submit"
              disabled={submitDisabled}
              cooldownRemainingSeconds={cooldownRemainingSeconds}
              pending={isSubmitting}
            />
          </form>
        ) : null}
      </CardContent>
    </Card>
  );
}
