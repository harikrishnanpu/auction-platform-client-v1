'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { Gavel, Hourglass } from 'lucide-react';

import { PlaceBidButton } from '@/components/auction/place-bid-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

import {
  arBtnPrimary,
  arCardCanvas,
  arInset,
  arType,
} from '../lib/auction-room-design';

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
  isAutoBidActive: boolean;
  showPlaceBid: boolean;
  cooldownRemainingSeconds: number;
  onPlaceBid: (amount: number) => Promise<{
    success: boolean;
    error?: string;
    nextBidMin?: number | null;
  }>;
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
  isAutoBidActive,
  showPlaceBid,
  cooldownRemainingSeconds,
  onPlaceBid,
}: AuctionRoomBidPanelProps) {
  const inputDisabled =
    !canInteract || isAuctionEnded || !isAuctionActive || isAutoBidActive;

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
    if (res.success && res.nextBidMin != null) {
      setValue('amount', String(res.nextBidMin), {
        shouldValidate: true,
        shouldDirty: false,
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
    <section className={arCardCanvas('overflow-hidden')}>
      <div className="border-b border-border/80 bg-muted/30 px-2.5 py-2">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-primary/10 text-primary">
            <Gavel className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0 space-y-0.5">
            <h2 className={arType.cardTitle}>{headline.title}</h2>
            <p className={arType.cardDesc}>{headline.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-2.5 py-2.5">
        <div>
          <p className="text-lg font-semibold tabular-nums tracking-tight text-foreground sm:text-xl">
            {primaryDisplay}
          </p>
          {auction ? (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Opening bid{' '}
              <span className="font-semibold tabular-nums text-foreground">
                {formatAuctionPrice(auction.startPrice)}
              </span>
            </p>
          ) : null}
        </div>

        <div className={arInset('px-2.5 py-1.5')}>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
              <Hourglass className="size-3 shrink-0" aria-hidden />
              Time left
            </span>
            <span
              className={cn(
                'font-mono text-[11px] font-semibold tabular-nums text-foreground sm:text-xs',
                isCountdownLowUrgency(endCountdown) &&
                  'text-amber-700 dark:text-amber-400'
              )}
            >
              {isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
            </span>
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Cooldown{' '}
            <span className="tabular-nums text-foreground">
              {auction?.bidCooldownSeconds ?? 0}s
            </span>
          </p>
        </div>

        {showPlaceBid ? (
          <form
            className="space-y-2.5"
            onSubmit={handleSubmit(onValidSubmit)}
            noValidate
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="place-bid-amount"
                className="text-xs font-semibold text-foreground"
              >
                Your bid
              </Label>
              {isAutoBidActive ? (
                <p className="text-[11px] text-muted-foreground">
                  Turn off auto bid to bid manually.
                </p>
              ) : null}
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
                  'h-9 rounded-[8px] border-border/80 bg-background text-sm tabular-nums text-foreground',
                  'placeholder:text-muted-foreground',
                  errors.amount &&
                    'border-destructive focus-visible:ring-destructive/20'
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
              className={arBtnPrimary('w-full text-sm')}
            />
          </form>
        ) : null}
      </div>
    </section>
  );
}
