'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { IAuctionDto, AuctionType } from '@/types/auction.type';
import {
  getAuctionCategoryName,
  getAuctionTypeLabel,
} from '@/lib/auction-utils';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useAuctionRoomCountdown } from '../hooks/useAuctionRoomCountdown';
import type { AuctionRoomMode } from '../realtime/useAuctionRoomSocket';
import { useAuctionRoomSocket } from '../realtime/useAuctionRoomSocket';
import {
  auctionStatusLabel,
  isAuctionEndedByStatus,
} from '../utils/auction-room.utils';

import { AuctionRoomAlert } from './AuctionRoomAlert';
import { AuctionRoomBidPanel } from './AuctionRoomBidPanel';
import { AuctionRoomChatPanel } from './AuctionRoomChatPanel';
import { AuctionRoomConnectionStatus } from './AuctionRoomConnectionStatus';
import { AuctionRoomDetailsSection } from './AuctionRoomDetailsSection';
import { AuctionRoomHero } from './AuctionRoomHero';
import { AuctionRoomLiveBidFeed } from './AuctionRoomLiveBidFeed';
import { AuctionRoomMetaBadges } from './AuctionRoomMetaBadges';
import { AuctionRoomSellerPanel } from './AuctionRoomSellerPanel';
import { AuctionRoomParticipantsPanel } from './AuctionRoomParticipantsPanel';

export function AuctionRoom({
  auctionId,
  mode,
  initialAuction,
}: {
  auctionId: string;
  mode: AuctionRoomMode;
  initialAuction?: IAuctionDto;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  const {
    auction,
    currentBid,
    liveFeed,
    connectionState,
    error,
    placeBid,
    chatMessages,
    sendChatMessage,
    participants,
    pauseAuction,
    resumeAuction,
    endAuction,
  } = useAuctionRoomSocket({
    auctionId,
    mode,
    initialAuction,
  });

  const canInteract = connectionState === 'connected' && !error;

  const [actionBusy, setActionBusy] = useState<
    'pause' | 'resume' | 'end' | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [bidAmount, setBidAmount] = useState('');
  const [chatDraft, setChatDraft] = useState('');

  const nextBidMin = useMemo(() => {
    if (!auction) return null;
    if (currentBid?.amount != null) {
      return currentBid.amount + auction.minIncrement;
    }
    return auction.startPrice;
  }, [auction, currentBid]);

  const endCountdown = useAuctionRoomCountdown(auction?.endAt);
  const auctionStatusStr = (auction?.status as unknown as string) ?? null;
  const isAuctionEnded = isAuctionEndedByStatus(
    auctionStatusStr ?? undefined,
    endCountdown
  );

  const parsedBid = useMemo(() => {
    const n = bidAmount.trim() ? Number(bidAmount) : NaN;
    return Number.isFinite(n) ? n : null;
  }, [bidAmount]);

  const onSubmitBid = useCallback(() => {
    if (parsedBid == null) return;
    placeBid(parsedBid);
    setBidAmount('');
  }, [parsedBid, placeBid]);

  const canControlAuction = mode === 'SELLER' || mode === 'ADMIN';

  const lastSuggestedBidRef = useRef<string | null>(null);
  useEffect(() => {
    if (mode !== 'USER') return;
    if (nextBidMin == null) return;
    const suggested = String(nextBidMin);
    const currentTrimmed = bidAmount.trim();

    const shouldReplace =
      currentTrimmed.length === 0 ||
      currentTrimmed === (lastSuggestedBidRef.current ?? '');

    lastSuggestedBidRef.current = suggested;

    if (shouldReplace) {
      // Sync suggested minimum bid when empty or still matching last suggestion.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional UX sync with server-driven nextBidMin
      setBidAmount(suggested);
    }
  }, [mode, nextBidMin, bidAmount]);

  const categoryName = auction ? getAuctionCategoryName(auction) : '—';
  const typeLabel = auction
    ? getAuctionTypeLabel(auction.auctionType as AuctionType)
    : '—';
  const statusLabel = auctionStatusStr
    ? auctionStatusLabel(auctionStatusStr)
    : '—';

  const handlePause = useCallback(async () => {
    setActionBusy('pause');
    setActionError(null);
    const res = await pauseAuction();
    setActionBusy(null);
    if (!res.success) {
      setActionError(res.error ?? 'Failed to pause auction');
    }
  }, [pauseAuction]);

  const handleResume = useCallback(async () => {
    setActionBusy('resume');
    setActionError(null);
    const res = await resumeAuction();
    setActionBusy(null);
    if (!res.success) {
      setActionError(res.error ?? 'Failed to resume auction');
    }
  }, [resumeAuction]);

  const handleEnd = useCallback(async () => {
    setActionBusy('end');
    setActionError(null);
    const res = await endAuction();
    setActionBusy(null);
    if (!res.success) {
      setActionError(res.error ?? 'Failed to end auction');
    }
  }, [endAuction]);

  const sendChat = useCallback(() => {
    const trimmed = chatDraft.trim();
    if (!trimmed) return;
    sendChatMessage(trimmed);
    setChatDraft('');
  }, [chatDraft, sendChatMessage]);

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-950/4 via-background to-background dark:from-amber-400/5">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">
        <div className="space-y-4">
          {error ? <AuctionRoomAlert message={error} /> : null}

          <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <header className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-3">
                  <h1 className="text-balance text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-2xl">
                    {auction?.title ?? (
                      <span className="text-muted-foreground">
                        Loading auction…
                      </span>
                    )}
                  </h1>
                  <AuctionRoomMetaBadges
                    categoryName={categoryName}
                    typeLabel={typeLabel}
                    statusLabel={statusLabel}
                    connectionSlot={
                      <AuctionRoomConnectionStatus state={connectionState} />
                    }
                  />
                </div>

                <div className="flex items-start justify-end">
                  <SheetTrigger asChild>
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-8 rounded-xl px-3"
                    >
                      Chat
                    </Button>
                  </SheetTrigger>
                </div>
              </div>

              <AuctionRoomHero auction={auction} />
            </header>

            <SheetContent
              side="left"
              className="w-80 sm:max-w-sm p-0"
              onClick={(e) => {
                // Keep focus inside sheet without affecting background.
                e.stopPropagation();
              }}
            >
              <div className="h-full p-2">
                <AuctionRoomChatPanel
                  messages={chatMessages}
                  draft={chatDraft}
                  onDraftChange={setChatDraft}
                  onSend={sendChat}
                  canInteract={canInteract}
                  dense
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start xl:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-4 lg:order-1">
              <AuctionRoomDetailsSection auction={auction} />
            </div>

            <aside className="space-y-4 lg:order-2 lg:sticky lg:top-6">
              <AuctionRoomBidPanel
                auction={auction}
                currentBidAmount={currentBid?.amount ?? null}
                nextBidMin={nextBidMin}
                endCountdown={endCountdown}
                isAuctionEnded={isAuctionEnded}
                canInteract={canInteract}
                showPlaceBid={mode === 'USER'}
                bidAmount={bidAmount}
                onBidAmountChange={setBidAmount}
                onSubmitBid={onSubmitBid}
                parsedBid={parsedBid}
              />

              {canControlAuction ? (
                <AuctionRoomSellerPanel
                  auctionStatus={auctionStatusStr}
                  canInteract={canInteract}
                  isAuctionEnded={isAuctionEnded}
                  actionBusy={actionBusy}
                  actionError={actionError}
                  onPause={handlePause}
                  onResume={handleResume}
                  onEnd={handleEnd}
                />
              ) : null}

              <AuctionRoomLiveBidFeed bids={liveFeed} mode={mode} />

              <AuctionRoomParticipantsPanel participants={participants} />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
