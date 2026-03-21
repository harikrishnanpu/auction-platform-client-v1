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
    <Card className="rounded-xl border-border/60 bg-card/70 shadow-sm">
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-semibold">Auction control</CardTitle>
        <CardDescription className="text-xs">
          Pause, resume, or end this auction for all participants.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {actionError ? (
          <AuctionRoomAlert message={actionError} variant="destructive" />
        ) : null}

        <div className="flex flex-col gap-2">
          {auctionStatus === 'ACTIVE' ? (
            <Button
              variant="outline"
              size="sm"
              className="h-10 justify-start gap-2 rounded-lg text-sm"
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
              size="sm"
              className="h-10 justify-start gap-2 rounded-lg text-sm"
              onClick={onResume}
              disabled={!canInteract || isAuctionEnded || actionBusy != null}
            >
              <Play className="size-4" />
              Resume auction
            </Button>
          ) : null}

          {auctionStatus === 'ACTIVE' || auctionStatus === 'PAUSED' ? (
            <Button
              variant="destructive"
              size="sm"
              className="h-10 justify-start gap-2 rounded-lg text-sm"
              onClick={onEnd}
              disabled={!canInteract || isAuctionEnded || actionBusy != null}
            >
              <Square className="size-4" />
              {actionBusy === 'end' ? 'Ending…' : 'End auction'}
            </Button>
          ) : null}

          {auctionStatus === 'ENDED' ||
          auctionStatus === 'SOLD' ||
          auctionStatus === 'COMPLETED' ? (
            <p className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              <Ban className="size-4 shrink-0" />
              This auction has ended. No further actions are available.
            </p>
          ) : null}

          {auctionStatus &&
          auctionStatus !== 'ACTIVE' &&
          auctionStatus !== 'PAUSED' &&
          auctionStatus !== 'ENDED' &&
          auctionStatus !== 'SOLD' &&
          auctionStatus !== 'COMPLETED' ? (
            <p className="text-sm text-muted-foreground">
              Controls are not available for status:{' '}
              <span className="font-mono">{auctionStatus}</span>
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
