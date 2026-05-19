'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getWalletAction } from '@/actions/user/wallet.actions';
import { createFraudReportAction } from '@/actions/admin/report.actions';

import type { IAuctionDto, AuctionType } from '@/types/auction.type';
import {
  auctionStatusLabel,
  getAuctionCategoryName,
  getAuctionTypeLabel,
} from '@/utils/auction-utils';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useAuctionRoomChat } from '../hooks/useAuctionRoomChat';
import { useAuctionRoomHostControls } from '../hooks/useAuctionRoomHostControls';
import { useAuctionRoomStatus } from '../hooks/useAuctionRoomStatus';
import { useBidCooldown } from '../hooks/useBidCooldown';
import type { AuctionRoomMode } from '@/types/auctionRoom.types';
import { useAuctionRoomSocket } from '../../../socket/useAuctionRoomSocket';
import {
  auctionParticipationDepositAmount,
  checkIsPlaceBidEligible,
  computeUserBidStanding,
  isLiveAuctionType,
  isSealedAuctionType,
} from '../utils/auction-room.utils';
import { buildAuctionRoomMetricTiles } from '../utils/auction-room-metrics';

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
import { AuctionFraudReportDialog } from './AuctionFraudReportDialog';
import { AuctionResultModal } from './AuctionResultModal';
import { AuctionSoldSummaryCard } from './AuctionSoldSummaryCard';
import { AuctionRoomYourPosition } from './AuctionRoomYourPosition';
import { FallbackPublicParticipantStatsCard } from './FallbackPublicParticipantStatsCard';
import useUserStore from '@/store/user.store';
import { AuctionRoomLiveStreamPanel } from './AuctionRoomLiveStreamPanel';
import { AuctionRoomAutoBidPanel } from './AuctionRoomAutoBidPanel';
import {
  AuctionRoomAnalyticsCharts,
  AuctionRoomAnalyticsKpis,
} from './AuctionRoomCenterAnalytics';
import { AuctionRoomListingHeader } from './AuctionRoomListingHeader';
import { SellerAuctionRoomLayout } from './seller-room/SellerAuctionRoomLayout';
import { UserAuctionRoomLayout } from './user-room/UserAuctionRoomLayout';

import { arCardCanvas, arContainer, arPage } from '../lib/auction-room-design';

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
  const [reportAuctionOpen, setReportAuctionOpen] = useState(false);
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
    autoBidConfig,
    nextBidMin,
    setAutoBidConfig,
    disableAutoBidConfig,
    metrics: roomMetrics,
    charts: roomCharts,
    isHostProducer,
    localStream,
    remoteStreams,
    isLocalAudioEnabled,
    isLocalVideoEnabled,
    toggleLocalAudio,
    toggleLocalVideo,
  } = useAuctionRoomSocket({
    auctionId,
    mode,
    initialAuction,
  });

  const { chatDraft, setChatDraft, sendChat } =
    useAuctionRoomChat(sendChatMessage);

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

  const metricTiles = useMemo(
    () =>
      buildAuctionRoomMetricTiles({
        auction,
        liveFeed,
        participantsCount: participants.length,
        metrics: roomMetrics,
        extensionsUsed: roomMetrics?.extensionsUsed ?? 0,
        endCountdown,
        isAuctionEnded,
        isAuctionActive,
        currentBidAmount: currentBid?.amount ?? null,
      }),
    [
      auction,
      liveFeed,
      participants.length,
      roomMetrics,
      endCountdown,
      isAuctionEnded,
      isAuctionActive,
      currentBid?.amount,
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
  const canReportParticipants = mode === 'SELLER' || mode === 'USER';

  const categoryName = auction ? getAuctionCategoryName(auction) : '—';
  const typeLabel = auction
    ? getAuctionTypeLabel(auction.auctionType as AuctionType)
    : '—';
  const statusLabel = auctionStatusStr
    ? auctionStatusLabel(auctionStatusStr)
    : '—';

  const listingSectionLabel =
    mode === 'USER'
      ? 'Auction room'
      : mode === 'SELLER'
        ? 'Your listing'
        : 'Admin · Auction';

  const handleReportParticipant = useCallback(
    async (input: {
      targetedUserId: string;
      reportedUserType?: 'USER' | 'SELLER';
      reason: string;
      category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
      level: 'LOW' | 'MEDIUM' | 'CRITICAL';
    }) => {
      const res = await createFraudReportAction({
        ...input,
        reportedUserId: user?.id ?? '',
        reportedUserType: mode === 'SELLER' ? 'SELLER' : 'USER',
      });
      if (!res.success) {
        toast.error(res.error ?? 'Failed to submit report');
        return;
      }
      toast.success('Report submitted');
    },
    [mode, user?.id]
  );

  const canReportAuction =
    mode === 'USER' &&
    Boolean(auction?.sellerId) &&
    auction?.sellerId !== user?.id;

  const handleReportAuction = useCallback(
    async (input: {
      reason: string;
      category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
      level: 'LOW' | 'MEDIUM' | 'CRITICAL';
    }) => {
      if (!auction?.sellerId) return;
      const res = await createFraudReportAction({
        reportedUserId: user?.id ?? '',
        reportedUserType: 'USER',
        targetedUserId: auction.sellerId,
        reason: input.reason,
        category: input.category,
        level: input.level,
      });
      if (!res.success) {
        toast.error(res.error ?? 'Failed to submit report');
        return;
      }
      toast.success('Auction report submitted');
    },
    [user?.id, auction]
  );

  const watchingCount =
    roomMetrics?.watchingNow != null && roomMetrics.watchingNow >= 0
      ? roomMetrics.watchingNow
      : 0;
  const bidCount =
    roomMetrics?.totalBidCount != null && roomMetrics.totalBidCount >= 0
      ? roomMetrics.totalBidCount
      : liveFeed.length;
  const extensionsUsed = roomMetrics?.extensionsUsed ?? 0;

  const userRoomModals = (
    <>
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

      <AuctionFraudReportDialog
        open={reportAuctionOpen}
        onOpenChange={setReportAuctionOpen}
        title="Report this auction"
        description="This will send a fraud report against the auction seller."
        submitLabel="Submit auction report"
        onSubmit={handleReportAuction}
      />
    </>
  );

  if (mode === 'SELLER') {
    return (
      <SellerAuctionRoomLayout
        auctionId={auctionId}
        auction={auction}
        auctionStatusStr={auctionStatusStr}
        endCountdown={endCountdown}
        isAuctionActive={isAuctionActive}
        isAuctionEnded={isAuctionEnded}
        isLiveRoom={isLiveRoom}
        currentBid={currentBid}
        nextBidMin={nextBidMin}
        liveFeed={liveFeed}
        participants={participants}
        chatMessages={chatMessages}
        chatDraft={chatDraft}
        onChatDraftChange={setChatDraft}
        onSendChat={sendChat}
        canInteract={canInteract}
        connectionState={connectionState}
        roomReady={roomReady}
        error={error}
        actionBusy={actionBusy}
        actionError={actionError}
        onPause={handlePause}
        onResume={handleResume}
        onEnd={handleEnd}
        allowSendPublicNotification={allowSendPublicNotification}
        onAuctionStatusOverride={setAuctionStatusOverride}
        onSendFallbackPublicNotification={sendFallbackPublicNotification}
        onMarkAuctionFailed={markAuctionFailed}
        soldSummary={soldSummaryDisplay}
        watchingCount={watchingCount}
        bidCount={bidCount}
        localStream={localStream}
        isHostProducer={isHostProducer}
        isLocalAudioEnabled={isLocalAudioEnabled}
        isLocalVideoEnabled={isLocalVideoEnabled}
        onToggleLocalAudio={toggleLocalAudio}
        onToggleLocalVideo={toggleLocalVideo}
      />
    );
  }

  if (mode === 'USER') {
    return (
      <>
        {userRoomModals}
        <UserAuctionRoomLayout
          auctionId={auctionId}
          auction={auction}
          auctionStatusStr={auctionStatusStr}
          endCountdown={endCountdown}
          isAuctionActive={isAuctionActive}
          isAuctionEnded={isAuctionEnded}
          isLiveRoom={isLiveRoom}
          isSealedRoom={isSealedRoom}
          currentBid={currentBid}
          nextBidMin={nextBidMin}
          liveFeed={liveFeed}
          participants={participants}
          chatMessages={chatMessages}
          chatDraft={chatDraft}
          onChatDraftChange={setChatDraft}
          onSendChat={sendChat}
          canInteract={canInteract}
          connectionState={connectionState}
          roomReady={roomReady}
          error={error}
          userBidStanding={userBidStanding}
          watchingCount={watchingCount}
          bidCount={bidCount}
          extensionsUsed={extensionsUsed}
          cooldownRemainingSeconds={cooldownRemainingSeconds}
          isAutoBidActive={Boolean(autoBidConfig?.isActive)}
          autoBidConfig={autoBidConfig}
          onPlaceBid={handlePlaceBid}
          setAutoBidConfig={setAutoBidConfig}
          disableAutoBidConfig={disableAutoBidConfig}
          soldSummary={soldSummaryDisplay}
          canReportAuction={canReportAuction}
          onReportAuction={() => setReportAuctionOpen(true)}
          onAuctionStatusOverride={setAuctionStatusOverride}
          payFallbackPublic={payFallbackPublic}
          verifyFallbackPublicAuctionPayment={
            verifyFallbackPublicAuctionPayment
          }
          onDeclineFallbackPublic={declineFallbackPublic}
          remoteStreams={remoteStreams}
          localStream={localStream}
          isHostProducer={isHostProducer}
        />
      </>
    );
  }

  return (
    <div className={arPage('relative')}>
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

      <AuctionFraudReportDialog
        open={reportAuctionOpen}
        onOpenChange={setReportAuctionOpen}
        title="Report this auction"
        description="This will send a fraud report against the auction seller."
        submitLabel="Submit auction report"
        onSubmit={handleReportAuction}
      />

      <div className={arContainer('relative')}>
        <div className="space-y-3">
          {error ? (
            <AuctionRoomAlert
              message={error}
              className={arCardCanvas('px-2.5 py-2')}
            />
          ) : null}

          {/* Listing (left) · main stage (center) · chat (right on xl) */}
          <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,280px)] xl:items-start xl:gap-5">
            <aside className="order-1 flex min-w-0 flex-col gap-3 xl:sticky xl:top-4 xl:max-h-[calc(100dvh-5rem)] xl:self-start xl:overflow-y-auto">
              <AuctionRoomListingHeader
                sectionLabel={listingSectionLabel}
                title={
                  auction?.title ?? (
                    <span className="text-muted-foreground">
                      Loading auction…
                    </span>
                  )
                }
                badgesSlot={
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
                }
                actionsSlot={
                  canReportAuction ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 shrink-0 rounded-lg px-3 text-xs font-semibold"
                      onClick={() => setReportAuctionOpen(true)}
                    >
                      Report
                    </Button>
                  ) : null
                }
              />
              <AuctionRoomMediaGallery
                key={auction?.id ?? auctionId}
                auction={auction}
              />
              <AuctionRoomDetailsSection auction={auction} />
            </aside>

            <main className="order-2 flex min-w-0 flex-col gap-3">
              <AuctionRoomLiveStreamPanel
                isLiveRoom={isLiveRoom}
                isHostProducer={isHostProducer}
                localStream={localStream}
                remoteStreams={remoteStreams}
                isLocalAudioEnabled={isLocalAudioEnabled}
                isLocalVideoEnabled={isLocalVideoEnabled}
                onToggleLocalAudio={toggleLocalAudio}
                onToggleLocalVideo={toggleLocalVideo}
              />
              <AuctionRoomAnalyticsKpis
                metricTiles={metricTiles}
                showLivePulse={isAuctionActive && !isAuctionEnded}
              />
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
                isAutoBidActive={Boolean(autoBidConfig?.isActive)}
                showPlaceBid={false}
                cooldownRemainingSeconds={cooldownRemainingSeconds}
                onPlaceBid={handlePlaceBid}
              />

              <AuctionRoomLiveBidFeed
                bids={liveFeed}
                mode={mode}
                isSealedRoom={isSealedRoom}
                isLiveRoom={isLiveRoom}
                currentUserId={user?.id}
              />

              {auctionStatusStr === 'SOLD' && soldSummaryDisplay ? (
                <AuctionSoldSummaryCard
                  winnerUserName={soldSummaryDisplay.winnerUserName}
                  soldAmount={soldSummaryDisplay.soldAmount}
                />
              ) : null}

              <AuctionRoomParticipantsPanel
                participants={participants}
                currentUserId={user?.id}
                canReport={canReportParticipants}
                onReportUser={handleReportParticipant}
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

              <AuctionRoomAnalyticsCharts
                auction={auction}
                liveFeed={liveFeed}
                charts={roomCharts}
                currentBidAmount={currentBid?.amount ?? null}
                isAuctionEnded={isAuctionEnded}
              />
            </main>

            <aside className="order-3 flex min-h-[min(360px,55vh)] min-w-0 flex-col xl:sticky xl:top-4 xl:h-[calc(100dvh-5rem)] xl:max-h-[calc(100dvh-5rem)] xl:min-h-0 xl:self-start">
              <div
                className={cn(
                  arCardCanvas(),
                  'flex min-h-0 flex-1 flex-col overflow-hidden'
                )}
              >
                <AuctionRoomChatPanel
                  className="min-h-0 flex-1"
                  messages={chatMessages}
                  draft={chatDraft}
                  onDraftChange={setChatDraft}
                  onSend={sendChat}
                  canInteract={canInteract}
                  dense
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
