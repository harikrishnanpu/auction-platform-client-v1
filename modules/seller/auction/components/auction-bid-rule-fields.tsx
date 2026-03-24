'use client';

import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { CreateAuctionFormValues } from '../schemas/create-auction.schema';

type Register = UseFormRegister<CreateAuctionFormValues>;

/** Avoid native `disabled` on RHF-controlled inputs so values still submit; use read-only + muted styles when sealed. */
export function sealedBidFieldClassNames(isSealed: boolean) {
  return isSealed
    ? 'pointer-events-none bg-muted/60 text-muted-foreground dark:bg-muted/40'
    : undefined;
}

export function sealedBidInputProps(isSealed: boolean, submitting: boolean) {
  return {
    readOnly: isSealed,
    disabled: submitting && !isSealed,
    className: sealedBidFieldClassNames(isSealed),
  } as const;
}

export function AuctionBidRuleThreeColumnFields({
  register,
  errors,
  isSealed,
  submitting,
}: {
  register: Register;
  errors: FieldErrors<CreateAuctionFormValues>;
  isSealed: boolean;
  submitting: boolean;
}) {
  const p = sealedBidInputProps(isSealed, submitting);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="antiSnipSeconds">Anti-snip (seconds)</Label>
        <Input
          id="antiSnipSeconds"
          type="number"
          step={1}
          {...register('antiSnipSeconds')}
          placeholder={isSealed ? '0' : '60'}
          className={cn('mt-1', p.className)}
          readOnly={p.readOnly}
          disabled={p.disabled}
        />
        {!isSealed ? (
          <p className="text-xs text-muted-foreground mt-1">
            Extend end time if bid in last N seconds
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            Not used for sealed auctions (sent as 0).
          </p>
        )}
        {errors.antiSnipSeconds && (
          <p className="text-destructive text-xs mt-1">
            {errors.antiSnipSeconds.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="maxExtensionCount">Max extensions</Label>
        <Input
          id="maxExtensionCount"
          type="number"
          step={1}
          {...register('maxExtensionCount')}
          placeholder={isSealed ? '0' : '3'}
          className={cn('mt-1', p.className)}
          readOnly={p.readOnly}
          disabled={p.disabled}
        />
        {errors.maxExtensionCount && (
          <p className="text-destructive text-xs mt-1">
            {errors.maxExtensionCount.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="bidCooldownSeconds">Bid cooldown (seconds)</Label>
        <Input
          id="bidCooldownSeconds"
          type="number"
          step={1}
          {...register('bidCooldownSeconds')}
          placeholder={isSealed ? '0' : '10'}
          className={cn('mt-1', p.className)}
          readOnly={p.readOnly}
          disabled={p.disabled}
        />
        {errors.bidCooldownSeconds && (
          <p className="text-destructive text-xs mt-1">
            {errors.bidCooldownSeconds.message}
          </p>
        )}
      </div>
    </div>
  );
}
