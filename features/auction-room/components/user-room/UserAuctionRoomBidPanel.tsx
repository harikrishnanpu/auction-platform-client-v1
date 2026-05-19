'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Gavel, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { IAuctionDto } from '@/types/auction.type';
import type { IAuctionRoomAutoBidConfig } from '@/types/auctionRoom.types';

import {
  type PlaceBidFormValues,
  validatePlaceBidAmount,
} from '../../schemas/place-bid.schema';
import { formatBidAmount } from '../seller-room/seller-room-helpers';
import { urCard, urSectionTitle } from './user-room-ui';

type UserAuctionRoomBidPanelProps = {
  auctionId: string;
  auction: IAuctionDto | null;
  currentBidAmount: number | null;
  nextBidMin: number | null;
  isAuctionEnded: boolean;
  isAuctionActive: boolean;
  canInteract: boolean;
  isAutoBidActive: boolean;
  autoBidConfig: IAuctionRoomAutoBidConfig | null;
  cooldownRemainingSeconds: number;
  onPlaceBid: (amount: number) => Promise<{
    success: boolean;
    error?: string;
    nextBidMin?: number | null;
  }>;
  onSetMaxBid: () => void;
};

export function UserAuctionRoomBidPanel({
  auctionId,
  auction,
  currentBidAmount,
  nextBidMin,
  isAuctionEnded,
  isAuctionActive,
  canInteract,
  isAutoBidActive,
  autoBidConfig,
  cooldownRemainingSeconds,
  onPlaceBid,
  onSetMaxBid,
}: UserAuctionRoomBidPanelProps) {
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
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<PlaceBidFormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: { amount: '' },
  });

  const amountField = register('amount', { validate: validateAmount });
  const didInitDefaultRef = useRef(false);
  const amountValue = watch('amount');

  useEffect(() => {
    didInitDefaultRef.current = false;
  }, [auctionId]);

  useEffect(() => {
    if (nextBidMin == null) return;
    if (didInitDefaultRef.current) return;
    didInitDefaultRef.current = true;
    setValue('amount', String(nextBidMin), {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [auctionId, nextBidMin, setValue]);

  useEffect(() => {
    if (nextBidMin == null) return;
    void trigger('amount');
  }, [nextBidMin, trigger]);

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

  const applyMinimumBid = () => {
    if (nextBidMin == null) return;
    setValue('amount', String(nextBidMin), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const submitDisabled =
    inputDisabled || isSubmitting || !isValid || cooldownRemainingSeconds > 0;

  const maxBidDisplay = autoBidConfig?.isActive
    ? formatBidAmount(autoBidConfig.maxBidAmount)
    : null;

  const parsedAmount = Number(amountValue?.trim());
  const isCustomAboveMin =
    nextBidMin != null &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > nextBidMin;

  return (
    <section className={urCard()}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
          <Gavel className="size-4" />
        </span>
        <div>
          <h2 className={urSectionTitle()}>Current Bid</h2>
          <p className="text-xl font-bold text-brand-600">
            {formatBidAmount(currentBidAmount)}
          </p>
        </div>
      </div>

      {maxBidDisplay ? (
        <div className="mt-4 rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
          <p className="text-[11px] font-medium text-muted-foreground">
            Your max bid
          </p>
          <p className="text-sm font-semibold tabular-nums text-foreground">
            {maxBidDisplay}
          </p>
        </div>
      ) : null}

      <form
        className="mt-4 space-y-3"
        onSubmit={handleSubmit(onValidSubmit)}
        noValidate
      >
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border border-border bg-muted/20 p-2.5">
            <p className="text-muted-foreground">Minimum next bid</p>
            <p className="mt-0.5 font-semibold tabular-nums">
              {formatBidAmount(nextBidMin)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-2.5">
            <p className="text-muted-foreground">Bid increment</p>
            <p className="mt-0.5 font-semibold tabular-nums">
              {formatBidAmount(auction?.minIncrement)}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="custom-bid-amount"
            className="text-xs font-medium text-muted-foreground"
          >
            Your bid amount
          </Label>
          <Input
            {...amountField}
            id="custom-bid-amount"
            type="number"
            inputMode="decimal"
            min={nextBidMin ?? undefined}
            step={auction?.minIncrement ?? 1}
            disabled={inputDisabled}
            placeholder={
              nextBidMin != null ? String(nextBidMin) : 'Enter amount'
            }
            className="h-10 rounded-lg border-border text-sm tabular-nums"
          />
          {errors.amount ? (
            <p className="text-xs text-destructive">{errors.amount.message}</p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Enter any amount at or above the minimum next bid.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={inputDisabled || nextBidMin == null}
            className="h-10 flex-1 rounded-lg text-sm font-semibold"
            onClick={applyMinimumBid}
          >
            Use min ({formatBidAmount(nextBidMin)})
          </Button>
          <Button
            type="submit"
            disabled={submitDisabled}
            className="h-10 flex-1 rounded-lg bg-brand-600 text-sm font-semibold hover:bg-brand-700"
          >
            {isSubmitting
              ? 'Placing…'
              : isCustomAboveMin
                ? `Place bid ${formatBidAmount(parsedAmount)}`
                : `Place bid ${formatBidAmount(nextBidMin)}`}
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={!canInteract || isAuctionEnded}
          className="h-10 w-full rounded-lg text-sm font-semibold"
          onClick={onSetMaxBid}
        >
          Set max bid
        </Button>
      </form>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Lock className="size-3 shrink-0" />
        Your bid is secure and private.
      </p>
    </section>
  );
}
