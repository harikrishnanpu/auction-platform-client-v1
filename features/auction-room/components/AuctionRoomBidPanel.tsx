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
    <Card className="rounded-xl border-border/50 bg-card/30 shadow-none">
      <CardHeader className="space-y-0 border-b border-border/35 px-2.5 py-2">
        <div className="flex items-start gap-2">
          <span className="mt-px flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Gavel className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0">
            <CardTitle className="text-xs font-semibold tracking-tight">
              {headline.title}
            </CardTitle>
            <CardDescription className="text-[10px] leading-snug">
              {headline.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 px-2.5 pb-2.5 pt-2">
        <div>
          <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">
            {primaryDisplay}
          </p>
          {auction ? (
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Opens at{' '}
              <span className="font-medium tabular-nums text-foreground/90">
                {formatAuctionPrice(auction.startPrice)}
              </span>
            </p>
          ) : null}
        </div>

        <div className="rounded-lg border border-border/40 bg-background/50 px-2 py-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
              <Hourglass className="size-3 shrink-0" aria-hidden />
              Time left
            </span>
            <span
              className={cn(
                'font-mono text-xs font-semibold tabular-nums',
                isCountdownLowUrgency(endCountdown) &&
                  'text-amber-700 dark:text-amber-400'
              )}
            >
              {isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
            </span>
          </div>
          <Badge
            variant="outline"
            className="mt-1 h-4 w-fit rounded px-1.5 text-[9px] font-normal"
          >
            Cooldown {auction?.bidCooldownSeconds ?? 0}s
          </Badge>
        </div>

        {showPlaceBid ? (
          <form
            className="space-y-2"
            onSubmit={handleSubmit(onValidSubmit)}
            noValidate
          >
            <div className="space-y-1">
              <Label htmlFor="place-bid-amount" className="text-[10px]">
                Your bid
              </Label>
              <Input
                id="place-bid-amount"
                inputMode="decimal"
                autoComplete="off"
                placeholder={
                  nextBidMin != null
                    ? `Min ${formatAuctionPrice(nextBidMin)}`
                    : 'Amount'
                }
                disabled={inputDisabled}
                className={cn(
                  'h-8 rounded-lg border-border/50 bg-background text-xs tabular-nums',
                  errors.amount && 'border-destructive'
                )}
                {...amountField}
              />
              {errors.amount?.message ? (
                <p className="text-[10px] text-destructive" role="alert">
                  {errors.amount.message}
                </p>
              ) : null}
            </div>
            <PlaceBidButton
              type="submit"
              disabled={submitDisabled}
              cooldownRemainingSeconds={cooldownRemainingSeconds}
              pending={isSubmitting}
              className="h-8 rounded-lg text-[11px]"
            />
          </form>
        ) : null}
      </CardContent>
    </Card>
  );
}
