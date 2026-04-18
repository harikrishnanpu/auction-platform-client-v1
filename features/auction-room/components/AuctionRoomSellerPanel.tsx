'use client';

import { useState } from 'react';

import { Ban, Pause, Play, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { AuctionIrreversibleConfirmDialog } from './AuctionIrreversibleConfirmDialog';
import { AuctionRoomAlert } from './AuctionRoomAlert';

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
      <Card className="rounded-xl border-border/50 bg-card/30 shadow-none">
        <CardHeader className="space-y-0 px-2.5 py-1.5 pb-0">
          <CardTitle className="text-[10px] font-semibold">Control</CardTitle>
          <CardDescription className="text-[9px] leading-snug">
            Pause, resume, or end.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 px-2.5 pb-2 pt-1">
          {actionError ? (
            <AuctionRoomAlert message={actionError} variant="destructive" />
          ) : null}

          <div className="flex flex-col gap-1.5">
            {auctionStatus === 'ACTIVE' ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 justify-start gap-1 rounded-md text-[11px]"
                onClick={onPause}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
              >
                <Pause className="size-3.5" />
                Pause auction
              </Button>
            ) : null}

            {auctionStatus === 'PAUSED' ? (
              <Button
                variant="outline"
                size="sm"
                className="h-7 justify-start gap-1 rounded-md text-[11px]"
                onClick={onResume}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
              >
                <Play className="size-3.5" />
                Resume auction
              </Button>
            ) : null}

            {auctionStatus === 'ACTIVE' || auctionStatus === 'PAUSED' ? (
              <Button
                variant="destructive"
                size="sm"
                className="h-7 justify-start gap-1 rounded-md text-[11px]"
                onClick={() => setEndConfirmOpen(true)}
                disabled={!canInteract || isAuctionEnded || actionBusy != null}
              >
                <Square className="size-3.5" />
                End auction
              </Button>
            ) : null}

            {auctionStatus === 'SOLD' ? (
              <p className="flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-2 py-1.5 text-[10px] leading-snug text-muted-foreground">
                <Ban className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                Sold — winner payment completed. No further actions are
                available.
              </p>
            ) : null}

            {auctionStatus === 'ENDED' ? (
              <p className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2 py-1.5 text-[10px] leading-snug text-muted-foreground">
                <Ban className="size-3 shrink-0" />
                This auction has ended. No further actions are available.
              </p>
            ) : null}

            {auctionStatus === 'FALLBACK_ENDED' ? (
              <p className="flex items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/5 px-2 py-1.5 text-[10px] leading-snug text-muted-foreground">
                <Ban className="size-3 shrink-0 text-amber-600 dark:text-amber-400" />
                Fallback period ended. Use the actions below to notify bidders
                or close the auction.
              </p>
            ) : null}

            {auctionStatus === 'FALLBACK_PUBLIC_NOTIFICATION' ? (
              <p className="flex items-center gap-1.5 rounded-lg border border-sky-500/25 bg-sky-500/5 px-2 py-1.5 text-[10px] leading-snug text-muted-foreground">
                <Ban className="size-3 shrink-0 text-sky-600 dark:text-sky-400" />
                Bidders can pay the start price or decline. No pause or end
                controls here.
              </p>
            ) : null}

            {auctionStatus &&
            auctionStatus !== 'ACTIVE' &&
            auctionStatus !== 'PAUSED' &&
            auctionStatus !== 'ENDED' &&
            auctionStatus !== 'SOLD' &&
            auctionStatus !== 'FALLBACK_ENDED' &&
            auctionStatus !== 'FALLBACK_PUBLIC_NOTIFICATION' ? (
              <p className="text-[10px] text-muted-foreground">
                Controls are not available for status:{' '}
                <span className="font-mono">{auctionStatus}</span>
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>

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
