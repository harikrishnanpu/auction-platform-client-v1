'use client';

import { Ban, Pause, Play, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
  onEnd: () => void;
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
  return (
    <Card className="rounded-lg border-border/60 bg-card/70 shadow-sm">
      <CardHeader className="px-3 py-2 pb-1">
        <CardTitle className="text-xs font-semibold">Auction control</CardTitle>
        <CardDescription className="text-[10px] leading-tight">
          Pause, resume, or end for everyone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 px-3 pb-3">
        {actionError ? (
          <AuctionRoomAlert message={actionError} variant="destructive" />
        ) : null}

        <div className="flex flex-col gap-1.5">
          {auctionStatus === 'ACTIVE' ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 justify-start gap-1.5 rounded-md text-xs"
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
              className="h-8 justify-start gap-1.5 rounded-md text-xs"
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
              className="h-8 justify-start gap-1.5 rounded-md text-xs"
              onClick={onEnd}
              disabled={!canInteract || isAuctionEnded || actionBusy != null}
            >
              <Square className="size-3.5" />
              {actionBusy === 'end' ? 'Ending…' : 'End auction'}
            </Button>
          ) : null}

          {auctionStatus === 'ENDED' ||
          auctionStatus === 'SOLD' ||
          auctionStatus === 'COMPLETED' ? (
            <p className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              <Ban className="size-3.5 shrink-0" />
              This auction has ended. No further actions are available.
            </p>
          ) : null}

          {auctionStatus &&
          auctionStatus !== 'ACTIVE' &&
          auctionStatus !== 'PAUSED' &&
          auctionStatus !== 'ENDED' &&
          auctionStatus !== 'SOLD' &&
          auctionStatus !== 'COMPLETED' ? (
            <p className="text-xs text-muted-foreground">
              Controls are not available for status:{' '}
              <span className="font-mono">{auctionStatus}</span>
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
