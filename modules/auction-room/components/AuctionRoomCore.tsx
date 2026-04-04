'use client';

import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type { IAuctionDto, AuctionType } from '@/types/auction.type';
import {
  auctionStatusLabel,
  getAuctionCategoryName,
  getAuctionTypeLabel,
} from '@/utils/auction-utils';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { useAuctionRoomChatSheet } from '../hooks/useAuctionRoomChatSheet';
import { useAuctionRoomHostControls } from '../hooks/useAuctionRoomHostControls';
import { useAuctionRoomStatus } from '../hooks/useAuctionRoomStatus';
import { useBidCooldown } from '../hooks/useBidCooldown';
import type { AuctionRoomMode } from '../../../socket/useAuctionRoomSocket';
import { useAuctionRoomSocket } from '../../../socket/useAuctionRoomSocket';
import {
  computeNextBidMin,
  isLiveAuctionType,
  isSealedAuctionType,
} from '../utils/auction-room.utils';

import { AuctionRoomAlert } from './AuctionRoomAlert';
import { AuctionRoomBidPanel } from './AuctionRoomBidPanel';
import { AuctionRoomChatPanel } from './AuctionRoomChatPanel';
import { AuctionRoomConnectionStatus } from './AuctionRoomConnectionStatus';
import { AuctionRoomDetailsSection } from './AuctionRoomDetailsSection';
import { AuctionRoomFallbackEndedPanel } from './AuctionRoomFallbackEndedPanel';
import { AuctionRoomFallbackPublicNotificationPanel } from './AuctionRoomFallbackPublicNotificationPanel';
import { AuctionRoomHero } from './AuctionRoomHero';
import { AuctionRoomLiveBidFeed } from './AuctionRoomLiveBidFeed';
import { AuctionRoomMetaBadges } from './AuctionRoomMetaBadges';
import { AuctionRoomParticipantsPanel } from './AuctionRoomParticipantsPanel';
import { AuctionRoomSellerPanel } from './AuctionRoomSellerPanel';
import { AuctionResultModal } from './AuctionResultModal';
import { AuctionSoldSummaryCard } from './AuctionSoldSummaryCard';
import { FallbackPublicParticipantStatsCard } from './FallbackPublicParticipantStatsCard';
import useUserStore from '@/store/user.store';

export type AuctionRoomCoreProps = {
  auctionId: string;
  mode: AuctionRoomMode;
  initialAuction?: IAuctionDto;
  allowSendPublicNotification: boolean;
  showFallbackParticipantStats: boolean;
};

export function AuctionRoomCore({
  auctionId,
  mode,
  initialAuction,
  allowSendPublicNotification,
  showFallbackParticipantStats,
}: AuctionRoomCoreProps) {
  const { user } = useUserStore();
  const [isResultModalDismissed, setIsResultModalDismissed] = useState(false);
  const [auctionStatusOverride, setAuctionStatusOverride] = useState<
    string | null
  >(null);

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
    sendFallbackPublicNotification,
    markAuctionFailed,
    payFallbackPublic,
    declineFallbackPublic,
    verifyFallbackPublicAuctionPayment,
    fallbackPublicParticipantStats,
    soldSummary,
  } = useAuctionRoomSocket({
    auctionId,
    mode,
    initialAuction,
  });

  const { chatOpen, setChatOpen, chatDraft, setChatDraft, sendChat } =
    useAuctionRoomChatSheet(sendChatMessage);

  const { actionBusy, actionError, handlePause, handleResume, handleEnd } =
    useAuctionRoomHostControls({
      pauseAuction,
      resumeAuction,
      endAuction,
    });

  const canInteract = connectionState === 'connected' && !error;
  const isSealedRoom = isSealedAuctionType(auction?.auctionType);
  const isLiveRoom = isLiveAuctionType(auction?.auctionType);

  const {
    remainingSeconds: cooldownRemainingSeconds,
    start: startBidCooldown,
  } = useBidCooldown();

  const nextBidMin = useMemo(
    () => computeNextBidMin(auction, currentBid?.amount ?? null),
    [auction, currentBid?.amount]
  );

  const { auctionStatusStr, endCountdown, isAuctionActive, isAuctionEnded } =
    useAuctionRoomStatus(auction, auctionStatusOverride);

  const soldSummaryDisplay = useMemo(() => {
    if (soldSummary) return soldSummary;
    if (auctionStatusStr !== 'SOLD' || currentBid?.amount == null) {
      return null;
    }
    const name =
      participants.find((p) => p.userId === currentBid.userId)?.userName ??
      'Winner';
    return {
      winnerUserName: name,
      winnerUserId: currentBid.userId,
      soldAmount: currentBid.amount,
    };
  }, [soldSummary, auctionStatusStr, currentBid, participants]);

  const resultOutcome = useMemo<'WIN' | 'LOSS' | 'ENDED'>(() => {
    const winnerUserId = currentBid?.userId ?? null;
    if (winnerUserId && user?.id === winnerUserId) return 'WIN';
    if (winnerUserId) return 'LOSS';
    return 'ENDED';
  }, [currentBid?.userId, user?.id]);

  const resultModalOpen =
    mode === 'USER' &&
    isAuctionEnded &&
    auctionStatusStr !== 'FALLBACK_PUBLIC_NOTIFICATION' &&
    auctionStatusStr !== 'SOLD' &&
    !isResultModalDismissed;

  const handlePlaceBid = useCallback(
    async (amount: number) => {
      const res = await placeBid(amount);
      if (res.success && auction) {
        startBidCooldown(auction.bidCooldownSeconds ?? 0);
      } else if (!res.success) {
        toast.error(res.error ?? 'Could not place bid');
      }
      return res;
    },
    [placeBid, auction, startBidCooldown]
  );

  const canControlAuction = mode === 'SELLER' || mode === 'ADMIN';

  const categoryName = auction ? getAuctionCategoryName(auction) : '—';
  const typeLabel = auction
    ? getAuctionTypeLabel(auction.auctionType as AuctionType)
    : '—';
  const statusLabel = auctionStatusStr
    ? auctionStatusLabel(auctionStatusStr)
    : '—';

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-950/4 via-background to-background dark:from-amber-400/5">
      <AuctionResultModal
        open={resultModalOpen}
        outcome={resultOutcome}
        title={auction?.title ?? 'Auction'}
        onOpenChange={(open) => {
          if (!open) {
            setIsResultModalDismissed(true);
          }
        }}
      />

      <div className="mx-auto max-w-6xl px-3 pb-12 pt-5 sm:px-5 lg:pb-14 lg:pt-6">
        <div className="space-y-3">
          {error ? <AuctionRoomAlert message={error} /> : null}

          <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-start lg:gap-6 xl:gap-8">
              <section className="min-w-0 space-y-2.5 lg:max-w-md">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1.5">
                    <h1 className="text-balance text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
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
                  <SheetTrigger asChild>
                    <Button
                      size="xs"
                      variant="outline"
                      className="h-7 shrink-0 rounded-lg px-2.5 text-xs"
                    >
                      Chat
                    </Button>
                  </SheetTrigger>
                </div>

                <AuctionRoomHero auction={auction} />

                <AuctionRoomDetailsSection auction={auction} />
              </section>

              <aside className="min-w-0 space-y-3 lg:sticky lg:top-5">
                {auctionStatusStr === 'SOLD' && soldSummaryDisplay ? (
                  <AuctionSoldSummaryCard
                    winnerUserName={soldSummaryDisplay.winnerUserName}
                    soldAmount={soldSummaryDisplay.soldAmount}
                  />
                ) : null}

                <AuctionRoomBidPanel
                  auctionId={auctionId}
                  auction={auction}
                  currentBidAmount={currentBid?.amount ?? null}
                  bidCount={liveFeed.length}
                  isSealedRoom={isSealedRoom}
                  isLiveRoom={isLiveRoom}
                  nextBidMin={nextBidMin}
                  endCountdown={endCountdown}
                  isAuctionEnded={isAuctionEnded}
                  isAuctionActive={isAuctionActive}
                  canInteract={canInteract}
                  showPlaceBid={mode === 'USER' && !isLiveRoom}
                  cooldownRemainingSeconds={cooldownRemainingSeconds}
                  onPlaceBid={handlePlaceBid}
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

                {canControlAuction && auctionStatusStr === 'FALLBACK_ENDED' ? (
                  <AuctionRoomFallbackEndedPanel
                    auctionId={auctionId}
                    allowSendPublicNotification={allowSendPublicNotification}
                    onStatusUpdated={setAuctionStatusOverride}
                    onSendPublicNotification={sendFallbackPublicNotification}
                    onMarkAuctionFailed={markAuctionFailed}
                  />
                ) : null}

                {showFallbackParticipantStats &&
                auctionStatusStr === 'FALLBACK_PUBLIC_NOTIFICATION' &&
                fallbackPublicParticipantStats ? (
                  <FallbackPublicParticipantStatsCard
                    pending={fallbackPublicParticipantStats.pending}
                    rejected={fallbackPublicParticipantStats.rejected}
                  />
                ) : null}

                {mode === 'USER' &&
                auctionStatusStr === 'FALLBACK_PUBLIC_NOTIFICATION' &&
                auction ? (
                  <AuctionRoomFallbackPublicNotificationPanel
                    auctionId={auctionId}
                    auctionTitle={auction.title}
                    startPrice={auction.startPrice}
                    canInteract={canInteract}
                    onStatusUpdated={setAuctionStatusOverride}
                    payFallbackPublic={payFallbackPublic}
                    verifyFallbackPublicAuctionPayment={
                      verifyFallbackPublicAuctionPayment
                    }
                    onDecline={declineFallbackPublic}
                  />
                ) : null}

                <AuctionRoomLiveBidFeed
                  bids={liveFeed}
                  mode={mode}
                  isSealedRoom={isSealedRoom}
                  isLiveRoom={isLiveRoom}
                />

                <AuctionRoomParticipantsPanel participants={participants} />
              </aside>
            </div>

            <SheetContent
              side="left"
              className="flex h-full w-[min(100vw,18rem)] flex-col gap-0 p-0 sm:max-w-[18rem]"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="flex h-full min-h-0 flex-1 flex-col">
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
        </div>
      </div>
    </div>
  );
}
