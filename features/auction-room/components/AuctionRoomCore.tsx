'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getWalletAction } from '@/actions/user/wallet.actions';

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
  auctionParticipationDepositAmount,
  checkIsPlaceBidEligible,
  computeNextBidMin,
  computeUserBidStanding,
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
import { AuctionRoomLiveBidFeed } from './AuctionRoomLiveBidFeed';
import { AuctionRoomMediaGallery } from './AuctionRoomMediaGallery';
import { AuctionRoomMetaBadges } from './AuctionRoomMetaBadges';
import { AuctionRoomParticipantsPanel } from './AuctionRoomParticipantsPanel';
import { AuctionRoomSellerPanel } from './AuctionRoomSellerPanel';
import { AuctionPlaceBidTermsModal } from './AuctionPlaceBidTermsModal';
import { AuctionResultModal } from './AuctionResultModal';
import { AuctionSoldSummaryCard } from './AuctionSoldSummaryCard';
import { AuctionRoomYourPosition } from './AuctionRoomYourPosition';
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
  const [placeBidTermsOpen, setPlaceBidTermsOpen] = useState(false);
  const [lockParticipantBusy, setLockParticipantBusy] = useState(false);
  const [walletMain, setWalletMain] = useState<number | null>(null);
  const [walletCurrency, setWalletCurrency] = useState('INR');
  const [isResultModalDismissed, setIsResultModalDismissed] = useState(false);
  const [auctionStatusOverride, setAuctionStatusOverride] = useState<
    string | null
  >(null);

  const {
    auction,
    currentBid,
    liveFeed,
    connectionState,
    roomReady,
    error,
    placeBid,
    addAuctionParticipant,
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

  const canInteract = connectionState === 'connected' && roomReady && !error;
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

  const isParticipant = Boolean(
    user?.id && checkIsPlaceBidEligible(user.id, participants)
  );

  const userBidStanding = useMemo(
    () =>
      computeUserBidStanding({
        mode,
        userId: user?.id,
        isParticipant,
        isAuctionActive,
        isAuctionEnded,
        isLiveRoom,
        isSealedRoom,
        currentBidUserId: currentBid?.userId,
        liveFeed,
      }),
    [
      mode,
      user?.id,
      isParticipant,
      isAuctionActive,
      isAuctionEnded,
      isLiveRoom,
      isSealedRoom,
      currentBid?.userId,
      liveFeed,
    ]
  );

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

  useEffect(() => {
    if (!placeBidTermsOpen || mode !== 'USER') return;
    let cancelled = false;
    void (async () => {
      const res = await getWalletAction();
      if (cancelled) return;
      if (res.success && res.data) {
        setWalletMain(res.data.mainBalance);
        setWalletCurrency(res.data.currency ?? 'INR');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [placeBidTermsOpen, mode]);

  const participationDeposit = auction
    ? auctionParticipationDepositAmount(auction.startPrice)
    : 0;

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
      if (mode === 'USER' && !checkIsPlaceBidEligible(user?.id, participants)) {
        setPlaceBidTermsOpen(true);
        return { success: false as const };
      }

      const res = await placeBid(amount);
      if (res.success && auction) {
        startBidCooldown(auction.bidCooldownSeconds ?? 0);
      } else if (!res.success && res.error) {
        toast.error(res.error);
      }
      return res;
    },
    [auction, mode, participants, placeBid, startBidCooldown, user?.id]
  );

  const handleLockParticipation = useCallback(async () => {
    setLockParticipantBusy(true);
    const res = await addAuctionParticipant();
    setLockParticipantBusy(false);
    if (!res.success) {
      toast.error(res.error ?? 'Could not lock amount');
      return;
    }
    toast.success('You can place bids now');
    setPlaceBidTermsOpen(false);
  }, [addAuctionParticipant]);

  const canControlAuction = mode === 'SELLER' || mode === 'ADMIN';

  const categoryName = auction ? getAuctionCategoryName(auction) : '—';
  const typeLabel = auction
    ? getAuctionTypeLabel(auction.auctionType as AuctionType)
    : '—';
  const statusLabel = auctionStatusStr
    ? auctionStatusLabel(auctionStatusStr)
    : '—';

  return (
    <div className="relative min-h-screen bg-background">
      <AuctionPlaceBidTermsModal
        open={placeBidTermsOpen}
        onOpenChange={setPlaceBidTermsOpen}
        depositAmount={participationDeposit}
        walletMain={walletMain}
        walletCurrency={walletCurrency}
        canInteract={canInteract}
        lockBusy={lockParticipantBusy}
        onLockAmount={() => void handleLockParticipation()}
      />

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

      <div className="relative mx-auto max-w-6xl px-3 pb-10 pt-4 sm:px-4 lg:px-6">
        <div className="space-y-3">
          {error ? <AuctionRoomAlert message={error} /> : null}

          <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <header className="flex flex-col gap-2 border-b border-border/40 pb-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1.5">
                <h1 className="text-balance text-lg font-semibold tracking-tight text-foreground sm:text-xl">
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
                    <AuctionRoomConnectionStatus
                      state={connectionState}
                      roomReady={roomReady}
                    />
                  }
                />
              </div>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 shrink-0 rounded-full border-border/60 px-3 text-[11px] font-medium"
                >
                  Chat
                </Button>
              </SheetTrigger>
            </header>

            <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
              <div className="min-w-0 space-y-3 xl:col-span-7">
                <AuctionRoomMediaGallery
                  key={auction?.id ?? auctionId}
                  auction={auction}
                />
                <AuctionRoomDetailsSection auction={auction} />
              </div>

              <aside className="min-w-0 space-y-2 xl:sticky xl:top-4 xl:col-span-5 xl:self-start">
                {mode === 'USER' ? (
                  <AuctionRoomYourPosition standing={userBidStanding} />
                ) : null}

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
                  currentUserId={user?.id}
                />

                <AuctionRoomParticipantsPanel
                  participants={participants}
                  currentUserId={user?.id}
                />
              </aside>
            </div>

            <SheetContent
              side="left"
              className="flex h-full w-[min(100vw,20rem)] flex-col gap-0 border-border/40 p-0 sm:max-w-sm"
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
