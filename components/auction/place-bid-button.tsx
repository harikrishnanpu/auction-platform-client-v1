'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PlaceBidButtonProps = {
  className?: string;
  cooldownRemainingSeconds: number;
  pending?: boolean;
  disabled: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
};

export function PlaceBidButton({
  className,
  cooldownRemainingSeconds,
  pending,
  disabled,
  type = 'button',
  onClick,
}: PlaceBidButtonProps) {
  const inCooldown = cooldownRemainingSeconds > 0;
  const label = pending
    ? 'Placing bid…'
    : inCooldown
      ? `Wait ${cooldownRemainingSeconds}s`
      : 'Place bid';

  return (
    <Button
      type={type}
      variant="default"
      onClick={type === 'button' ? onClick : undefined}
      disabled={disabled || inCooldown || pending}
      className={cn(
        'h-9 gap-2 rounded-[8px] text-sm font-semibold shadow-none',
        className
      )}
    >
      {pending ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      ) : null}
      {label}
    </Button>
  );
}
