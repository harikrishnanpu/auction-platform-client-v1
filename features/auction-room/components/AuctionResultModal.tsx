'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AuctionResultModal({
  open,
  outcome,
  title,
  onOpenChange,
}: {
  open: boolean;
  outcome: 'WIN' | 'LOSS' | 'ENDED';
  title: string;
  onOpenChange: (open: boolean) => void;
}) {
  const heading =
    outcome === 'WIN'
      ? 'You won this auction'
      : outcome === 'LOSS'
        ? 'You lost this auction'
        : 'Auction ended';

  const description =
    outcome === 'WIN'
      ? `Congratulations! You placed the winning bid for "${title}".`
      : outcome === 'LOSS'
        ? `The auction "${title}" has ended and another bidder won.`
        : `The auction "${title}" has ended.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Okay</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
