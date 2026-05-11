'use client';

import { useState } from 'react';

import { Ban, Pause, Play, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { AuctionIrreversibleConfirmDialog } from './AuctionIrreversibleConfirmDialog';
import { AuctionRoomAlert } from './AuctionRoomAlert';

import {
  arBtnSecondary,
  arCardCanvas,
  arType,
} from '../lib/auction-room-design';

type ActionBusy = 'pause' | 'resume' | 'end' | null;

type AuctionRoomSellerPanelProps = {
  auctionStatus: string | null;
  canInteract: boolean;
  isAuctionEnded: boolean;
  actionBusy: ActionBusy;
  actionError: string | null;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => Promise<boolean>;
};

export function AuctionRoomSellerPanel({
  auctionStatus,
  canInteract,
  isAuctionEnded,
  actionBusy,
  actionError,
  onPause,
  onResume,
  onEnd,
}: AuctionRoomSellerPanelProps) {
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);

  return (
    <>
      <section className={arCardCanvas('overflow-hidden')}>
        <div className="border-b border-border/80 px-2.5 py-2">
          <h3 className={arType.cardTitle}>Host controls</h3>
          <p className={arType.cardDesc}>Pause, resume, or end.</p>
        </div>
        <div className="space-y-2 px-2.5 py-2">
          {actionError ? (
            <AuctionRoomAlert message={actionError} variant="destructive" />
          ) : null}

          <div className="flex flex-col gap-2">
            {auctionStatus === 'ACTIVE' ? (
              <Button
                variant="outline"
                type="button"
                className={cn(
                  arBtnSecondary('h-11 justify-start gap-2 px-4'),
                  'border-border/80'
                )}
                onClick={onPause}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
              >
                <Pause className="size-4" />
                Pause auction
              </Button>
            ) : null}

            {auctionStatus === 'PAUSED' ? (
              <Button
                variant="outline"
                type="button"
                className={cn(
                  arBtnSecondary('h-11 justify-start gap-2 px-4'),
                  'border-border/80'
                )}
                onClick={onResume}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
              >
                <Play className="size-4" />
                Resume auction
              </Button>
            ) : null}

            {auctionStatus === 'ACTIVE' || auctionStatus === 'PAUSED' ? (
              <Button
                type="button"
                variant="destructive"
                className="h-11 justify-start gap-2 rounded-[8px] px-4 text-sm font-semibold"
                onClick={() => setEndConfirmOpen(true)}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
              >
                <Square className="size-4" />
                End auction
              </Button>
            ) : null}

            {auctionStatus === 'SOLD' ? (
              <p className="flex gap-2 rounded-[8px] border border-emerald-500/25 bg-emerald-500/[0.06] px-3 py-2 text-xs leading-relaxed text-emerald-800 dark:text-emerald-100">
                <Ban className="mt-0.5 size-4 shrink-0" />
                Sold — settlement complete. No further host actions.
              </p>
            ) : null}

            {auctionStatus === 'ENDED' ? (
              <p className="flex gap-2 rounded-[8px] border border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                <Ban className="mt-0.5 size-3.5 shrink-0 text-foreground/70" />
                This auction has ended. Controls are closed.
              </p>
            ) : null}

            {auctionStatus === 'FALLBACK_ENDED' ? (
              <p className="flex gap-2 rounded-[12px] border border-amber-400/30 bg-amber-500/[0.07] px-4 py-3 text-sm text-amber-950 dark:text-amber-100">
                <Ban className="mt-0.5 size-4 shrink-0" />
                Fallback window ended — use the panel below for bidder outreach.
              </p>
            ) : null}

            {auctionStatus === 'FALLBACK_PUBLIC_NOTIFICATION' ? (
              <p className="flex gap-2 rounded-[12px] border border-sky-400/30 bg-sky-500/[0.07] px-4 py-3 text-sm text-sky-950 dark:text-sky-100">
                <Ban className="mt-0.5 size-4 shrink-0" />
                Public-offer phase — bidders pay or decline. No pause/end here.
              </p>
            ) : null}

            {auctionStatus &&
            auctionStatus !== 'ACTIVE' &&
            auctionStatus !== 'PAUSED' &&
            auctionStatus !== 'ENDED' &&
            auctionStatus !== 'SOLD' &&
            auctionStatus !== 'FALLBACK_ENDED' &&
            auctionStatus !== 'FALLBACK_PUBLIC_NOTIFICATION' ? (
              <p className="text-xs text-muted-foreground">
                Controls unavailable for status{' '}
                <span className="font-mono text-foreground">
                  {auctionStatus}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <AuctionIrreversibleConfirmDialog
        open={endConfirmOpen}
        onOpenChange={setEndConfirmOpen}
        title="End this auction?"
        actionDescription="The auction will close immediately. No further bids will be accepted."
        confirmLabel="End auction"
        confirmVariant="destructive"
        pending={actionBusy === 'end'}
        onConfirm={onEnd}
      />
    </>
  );
}
