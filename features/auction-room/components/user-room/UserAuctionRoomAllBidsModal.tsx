'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatAuctionDateTime } from '@/utils/auction-utils';
import type {
  IAuctionRoomBid,
  IAuctionRoomParticipant,
} from '@/types/auctionRoom.types';

import { useAuctionBids } from '../../hooks/use-auction-bids';
import {
  formatBidAmount,
  formatAuctionNumberDisplay,
  getBidderName,
  getUserInitials,
} from '../seller-room/seller-room-helpers';
import type { IAuctionDto } from '@/types/auction.type';

type UserAuctionRoomAllBidsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auctionId: string;
  auction: IAuctionDto | null;
  participants: IAuctionRoomParticipant[];
  currentLeadUserId?: string | null;
};

function BidRow({
  bid,
  index,
  participants,
  currentLeadUserId,
}: {
  bid: IAuctionRoomBid;
  index: number;
  participants: IAuctionRoomParticipant[];
  currentLeadUserId?: string | null;
}) {
  const name = getBidderName(bid.userId, participants);
  const isLead = index === 0 && currentLeadUserId === bid.userId;

  return (
    <li className="flex items-center justify-between gap-3 border-b border-border/60 py-2.5 last:border-0">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
          {getUserInitials(name)}
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="truncate text-[13px] font-medium">{name}</span>
            {isLead ? (
              <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-semibold text-brand-700">
                Current lead
              </span>
            ) : null}
          </div>
          <time
            className="text-[11px] text-muted-foreground"
            dateTime={bid.createdAt}
          >
            {formatAuctionDateTime(bid.createdAt)}
          </time>
        </div>
      </div>
      <p className="shrink-0 text-sm font-semibold tabular-nums">
        {formatBidAmount(bid.amount)}
      </p>
    </li>
  );
}

export function UserAuctionRoomAllBidsModal({
  open,
  onOpenChange,
  auctionId,
  auction,
  participants,
  currentLeadUserId,
}: UserAuctionRoomAllBidsModalProps) {
  const { bids, total, loading, error, fetchBids } = useAuctionBids(auctionId);

  useEffect(() => {
    if (!open) return;
    void fetchBids();
  }, [open, fetchBids]);

  const auctionLabel = formatAuctionNumberDisplay(auction);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(85vh,640px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-4 py-3.5">
          <DialogTitle className="text-base">All bids</DialogTitle>
          <p className="text-[13px] font-normal text-muted-foreground">
            {auctionLabel !== '—' ? auctionLabel : auction?.title}
            {total > 0 ? ` · ${total} bid${total === 1 ? '' : 's'}` : ''}
          </p>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-7 animate-spin text-brand-600" />
            </div>
          ) : error ? (
            <p className="py-8 text-center text-[13px] text-destructive">
              {error}
            </p>
          ) : bids.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-muted-foreground">
              No bids yet.
            </p>
          ) : (
            <ul>
              {bids.map((bid, index) => (
                <BidRow
                  key={bid.id}
                  bid={bid}
                  index={index}
                  participants={participants}
                  currentLeadUserId={currentLeadUserId}
                />
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
