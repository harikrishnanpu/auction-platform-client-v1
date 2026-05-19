'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Download,
  ExternalLink,
  Eye,
  Gavel,
  Hourglass,
  IndianRupee,
  MapPin,
  Package,
  Pencil,
  Share2,
  Tag,
  TrendingUp,
  HeartPulse,
} from 'lucide-react';
import { toast } from 'sonner';

import type { IAuctionDto } from '@/types/auction.type';
import type {
  IAuctionRoomBid,
  IAuctionRoomChatMessage,
  IAuctionRoomParticipant,
} from '@/types/auctionRoom.types';
import { cn } from '@/lib/utils';
import {
  auctionStatusLabel,
  formatAuctionDateTime,
  getAuctionCategoryName,
} from '@/utils/auction-utils';

import { AuctionIrreversibleConfirmDialog } from '../AuctionIrreversibleConfirmDialog';
import { AuctionRoomAlert } from '../AuctionRoomAlert';
import { AuctionSoldSummaryCard } from '../AuctionSoldSummaryCard';
import { getAuctionMediaItems } from '../../utils/auction-room.utils';

import { SellerAuctionRoomHostControls } from './SellerAuctionRoomHostControls';
import { SellerAuctionRoomLiveSidebar } from './SellerAuctionRoomLiveSidebar';
import { SellerAuctionRoomLiveStream } from './SellerAuctionRoomLiveStream';
import { SellerAuctionRoomTopBar } from './SellerAuctionRoomTopBar';
import { SellerAuctionRoomChat } from './SellerAuctionRoomChat';
import {
  formatBidAmount,
  formatAuctionEndHint,
  formatAuctionNumberDisplay,
  getBidderName,
  getParticipantHighBid,
  getUserInitials,
} from './seller-room-helpers';
import { srCard, srPage, srSectionTitle } from './seller-room-ui';

type ActionBusy = 'pause' | 'resume' | 'end' | null;

export type SellerAuctionRoomLayoutProps = {
  auctionId: string;
  auction: IAuctionDto | null;
  auctionStatusStr: string | null;
  endCountdown: string | null;
  isAuctionActive: boolean;
  isAuctionEnded: boolean;
  isLiveRoom: boolean;
  currentBid: IAuctionRoomBid | null;
  nextBidMin: number | null;
  liveFeed: IAuctionRoomBid[];
  participants: IAuctionRoomParticipant[];
  chatMessages: IAuctionRoomChatMessage[];
  chatDraft: string;
  onChatDraftChange: (v: string) => void;
  onSendChat: () => void;
  canInteract: boolean;
  connectionState: string;
  roomReady: boolean;
  error: string | null;
  actionBusy: ActionBusy;
  actionError: string | null;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => Promise<boolean>;
  allowSendPublicNotification: boolean;
  onAuctionStatusOverride: (status: string | null) => void;
  onSendFallbackPublicNotification: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
  onMarkAuctionFailed: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
  soldSummary?: {
    winnerUserName: string;
    soldAmount: number;
  } | null;
  watchingCount: number;
  bidCount: number;
  localStream: MediaStream | null;
  isHostProducer: boolean;
  isLocalAudioEnabled: boolean;
  isLocalVideoEnabled: boolean;
  onToggleLocalAudio: () => void;
  onToggleLocalVideo: () => void;
};

function HeroStatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-[#f0f3f8] p-2.5 sm:p-3 dark:bg-muted/40">
      <div className="flex size-7 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
        {icon}
      </div>
      <p className="mt-2 text-[10px] font-medium text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-base font-bold leading-tight tabular-nums text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-brand-600">{icon}</span>
        {label}
      </div>
      <span className="text-right text-xs font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

function HealthRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm text-foreground">
        <Check className="size-4 text-emerald-600" />
        {label}
      </div>
      <span className="text-sm text-muted-foreground">{status}</span>
    </div>
  );
}

export function SellerAuctionRoomLayout({
  auctionId,
  auction,
  auctionStatusStr,
  endCountdown,
  isAuctionActive,
  isAuctionEnded,
  isLiveRoom,
  currentBid,
  nextBidMin,
  liveFeed,
  participants,
  chatMessages,
  chatDraft,
  onChatDraftChange,
  onSendChat,
  canInteract,
  connectionState,
  roomReady,
  error,
  actionBusy,
  actionError,
  onPause,
  onResume,
  onEnd,
  allowSendPublicNotification,
  onAuctionStatusOverride,
  onSendFallbackPublicNotification,
  onMarkAuctionFailed,
  soldSummary,
  watchingCount,
  bidCount,
  localStream,
  isHostProducer,
  isLocalAudioEnabled,
  isLocalVideoEnabled,
  onToggleLocalAudio,
  onToggleLocalVideo,
}: SellerAuctionRoomLayoutProps) {
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);

  const mediaItems = auction ? getAuctionMediaItems(auction) : [];
  const heroImage = mediaItems[0]?.url;
  const categoryName = auction ? getAuctionCategoryName(auction) : '—';
  const statusLabel = auctionStatusStr
    ? auctionStatusLabel(auctionStatusStr)
    : '—';
  const isLive = auctionStatusStr === 'ACTIVE' || auctionStatusStr === 'LIVE';
  const leadName = currentBid
    ? getBidderName(currentBid.userId, participants)
    : null;
  const currentLeadUserId = currentBid?.userId ?? null;

  const sortedBids = useMemo(
    () =>
      [...liveFeed].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [liveFeed]
  );

  const displayBids = sortedBids.slice(0, 5);
  const connectionOk = connectionState === 'connected' && roomReady;
  const streamActive =
    isHostProducer && Boolean(localStream) && isLocalVideoEnabled;
  const streamStatus = !isLiveRoom
    ? 'N/A'
    : streamActive
      ? 'Active'
      : isHostProducer
        ? 'Camera off'
        : 'Starting…';

  const sellerName = useMemo(() => {
    if (!auction?.sellerId) return 'You';
    return (
      participants.find((p) => p.userId === auction.sellerId)?.userName ?? 'You'
    );
  }, [auction, participants]);

  const liveNotice = isLiveRoom ? (
    <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100">
      <span className="font-semibold">Live auction:</span> You are broadcasting
      to bidders. All bids are final and binding.
    </div>
  ) : null;

  const rightSidebar = isLiveRoom ? (
    <SellerAuctionRoomLiveSidebar
      className="w-full min-[1320px]:w-[300px] min-[1320px]:shrink-0"
      sellerId={auction?.sellerId}
      sellerName={sellerName}
      heroImageUrl={heroImage}
      messages={chatMessages}
      draft={chatDraft}
      onDraftChange={onChatDraftChange}
      onSend={onSendChat}
      canInteract={canInteract}
      participants={participants}
      watchingCount={watchingCount}
      currentLeadUserId={currentLeadUserId}
      isLocalAudioEnabled={isLocalAudioEnabled}
      isLocalVideoEnabled={isLocalVideoEnabled}
      isHostProducer={isHostProducer}
    />
  ) : (
    <SellerAuctionRoomChat
      className="w-full min-[1320px]:w-[252px] min-[1320px]:shrink-0"
      messages={chatMessages}
      draft={chatDraft}
      onDraftChange={onChatDraftChange}
      onSend={onSendChat}
      canInteract={canInteract}
      currentLeadUserId={currentLeadUserId}
    />
  );

  return (
    <>
      <AuctionIrreversibleConfirmDialog
        open={endConfirmOpen}
        onOpenChange={setEndConfirmOpen}
        title="End this auction?"
        actionDescription="This will close bidding immediately. This action cannot be undone."
        confirmLabel="End auction"
        confirmVariant="destructive"
        pending={actionBusy === 'end'}
        onConfirm={onEnd}
      />

      <div className={cn(srPage(), 'w-full min-w-0')}>
        <SellerAuctionRoomTopBar />

        {error ? (
          <AuctionRoomAlert message={error} className={cn(srCard(), 'mb-4')} />
        ) : null}

        <div className="flex flex-col gap-3 min-[1320px]:flex-row min-[1320px]:items-start min-[1320px]:gap-4">
          {/* Main content */}
          <div className="min-w-0 flex-1 space-y-3">
            {liveNotice}

            {isLiveRoom ? (
              <section className={srCard('overflow-hidden p-0')}>
                <div className="flex flex-col gap-4 p-3.5 sm:p-4 lg:flex-row lg:items-stretch lg:gap-5">
                  <SellerAuctionRoomLiveStream
                    className="min-w-0 flex-[1.35] lg:max-w-[58%]"
                    localStream={localStream}
                    isHostProducer={isHostProducer}
                    isLocalAudioEnabled={isLocalAudioEnabled}
                    isLocalVideoEnabled={isLocalVideoEnabled}
                    onToggleLocalAudio={onToggleLocalAudio}
                    onToggleLocalVideo={onToggleLocalVideo}
                    watchingCount={watchingCount}
                    isLive={isLive}
                    messages={chatMessages}
                    chatDraft={chatDraft}
                    onChatDraftChange={onChatDraftChange}
                    onSendChat={onSendChat}
                    canInteract={canInteract}
                    sellerId={auction?.sellerId}
                    currentLeadUserId={currentLeadUserId}
                    heroImageUrl={heroImage}
                    auctionTitle={auction?.title}
                  />
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 lg:max-w-[42%]">
                    <div>
                      <h1 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
                        {auction?.title ?? 'Loading auction…'}
                      </h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {formatAuctionNumberDisplay(auction)}
                        </span>
                        <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-950/50 dark:text-brand-300">
                          Live Auction
                        </span>
                        {isLive ? (
                          <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {statusLabel}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {auction?.description?.trim() ||
                          'No description provided.'}
                      </p>
                      <Link
                        href={`/seller/auction/${auctionId}/edit`}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
                      >
                        <Pencil className="size-3.5" />
                        Edit Details
                      </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="rounded-xl border border-border/80 bg-[#f0f4fb] p-3 dark:bg-muted/30">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Time Left
                        </p>
                        <p className="mt-1 text-2xl font-bold tabular-nums text-brand-600 sm:text-3xl">
                          {isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {formatAuctionEndHint(auction)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-border/80 bg-[#f0f4fb] p-3 dark:bg-muted/30">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Current Lead
                        </p>
                        <p className="mt-1 text-2xl font-bold tabular-nums text-brand-600 sm:text-3xl">
                          {formatBidAmount(currentBid?.amount)}
                        </p>
                        {leadName ? (
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            by {leadName}
                          </p>
                        ) : (
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            No bids yet
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>
                          <Eye className="mr-1 inline size-3.5 text-brand-600" />
                          {watchingCount} watching
                        </span>
                        <span>
                          <Gavel className="mr-1 inline size-3.5 text-brand-600" />
                          {bidCount} bids
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <div className={srCard('p-0 overflow-hidden')}>
                <div className="flex flex-col gap-3 p-3.5 sm:p-4 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:gap-4">
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
                      {heroImage ? (
                        <Image
                          src={heroImage}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-muted-foreground">
                          <Package className="size-10" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-sm font-semibold leading-snug text-foreground">
                        {auction?.title ?? 'Loading auction…'}
                      </h1>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatAuctionNumberDisplay(auction)}
                        </span>
                        {isLive ? (
                          <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                            {statusLabel}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {auction?.description?.trim() ||
                          'No description provided.'}
                      </p>
                      <Link
                        href={`/seller/auction/${auctionId}/edit`}
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
                      >
                        <Pencil className="size-3.5" />
                        Edit Details
                      </Link>
                    </div>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-2 min-[1100px]:grid-cols-4 min-[1100px]:flex-1 min-[1100px]:max-w-[52%]">
                    <HeroStatCard
                      icon={<Clock className="size-5" />}
                      label="Time Left"
                      value={isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
                      hint={formatAuctionEndHint(auction)}
                    />
                    <HeroStatCard
                      icon={<IndianRupee className="size-5" />}
                      label="Current Lead"
                      value={formatBidAmount(currentBid?.amount)}
                      hint={leadName ? `by ${leadName}` : undefined}
                    />
                    <HeroStatCard
                      icon={<Gavel className="size-4" />}
                      label="Your Opening Bid"
                      value={formatBidAmount(auction?.startPrice)}
                    />
                    <HeroStatCard
                      icon={<TrendingUp className="size-5" />}
                      label="Next Minimum Bid"
                      value={formatBidAmount(nextBidMin)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Three columns */}
            <div className="grid gap-3 min-[1180px]:grid-cols-3">
              {/* Left column */}
              <div className="space-y-3">
                <section className={srCard()}>
                  <h2 className={srSectionTitle()}>Auction Details</h2>
                  <div className="mt-3 divide-y divide-border">
                    <DetailRow
                      icon={<Calendar className="size-4" />}
                      label="Starts"
                      value={
                        auction?.startAt
                          ? formatAuctionDateTime(auction.startAt)
                          : '—'
                      }
                    />
                    <DetailRow
                      icon={<Clock className="size-4" />}
                      label="Ends"
                      value={
                        auction?.endAt
                          ? formatAuctionDateTime(auction.endAt)
                          : '—'
                      }
                    />
                    <DetailRow
                      icon={<IndianRupee className="size-4" />}
                      label="Opening Bid"
                      value={formatBidAmount(auction?.startPrice)}
                    />
                    <DetailRow
                      icon={<Package className="size-4" />}
                      label="Condition"
                      value={auction?.condition ?? '—'}
                    />
                    <DetailRow
                      icon={<Tag className="size-4" />}
                      label="Category"
                      value={categoryName}
                    />
                    <DetailRow
                      icon={<MapPin className="size-4" />}
                      label="Location"
                      value="Online"
                    />
                    <DetailRow
                      icon={<Tag className="size-4" />}
                      label="SKU"
                      value={auctionId.slice(0, 8).toUpperCase()}
                    />
                  </div>
                  <Link
                    href={`/auction/${auctionId}`}
                    target="_blank"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
                  >
                    View Public Listing
                    <ExternalLink className="size-4" />
                  </Link>
                </section>

                <section className={srCard()}>
                  <div className="flex items-center gap-2">
                    <HeartPulse className="size-4 text-emerald-600" />
                    <h2 className={srSectionTitle()}>Everything looks good</h2>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Auction health
                  </p>
                  <div className="mt-4 space-y-1">
                    <HealthRow
                      label="Internet Connection"
                      status={connectionOk ? 'Stable' : 'Connecting…'}
                    />
                    <HealthRow label="Live Stream" status={streamStatus} />
                    <HealthRow label="Bids Sync" status="Synced" />
                    <HealthRow label="Notifications" status="Active" />
                  </div>
                </section>
              </div>

              {/* Middle column */}
              <div className="space-y-3">
                <section className={srCard()}>
                  <div className="flex items-center gap-2">
                    <Gavel className="size-4 text-brand-600" />
                    <h2 className={srSectionTitle()}>Current Bid</h2>
                  </div>
                  <p className="mt-2.5 text-2xl font-bold text-brand-600">
                    {formatBidAmount(currentBid?.amount)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Opening bid {formatBidAmount(auction?.startPrice)}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Hourglass className="size-3.5" />
                        Time left
                      </div>
                      <p className="mt-0.5 text-base font-bold tabular-nums">
                        {isAuctionEnded ? 'Ended' : (endCountdown ?? '—')}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <TrendingUp className="size-3.5" />
                        Bid increment
                      </div>
                      <p className="mt-0.5 text-base font-bold tabular-nums">
                        {formatBidAmount(auction?.minIncrement)}
                      </p>
                    </div>
                  </div>
                </section>

                <section className={srCard()}>
                  <h2 className={srSectionTitle()}>Bid Activity</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[280px] text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                          <th className="pb-2 font-medium">Bidder</th>
                          <th className="pb-2 font-medium">Date & Time</th>
                          <th className="pb-2 text-right font-medium">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayBids.length === 0 ? (
                          <tr>
                            <td
                              colSpan={3}
                              className="py-8 text-center text-muted-foreground"
                            >
                              No bids yet
                            </td>
                          </tr>
                        ) : (
                          displayBids.map((b, index) => {
                            const name = getBidderName(b.userId, participants);
                            const isLead = index === 0;
                            return (
                              <tr
                                key={b.id}
                                className="border-b border-border/60 last:border-0"
                              >
                                <td className="py-2">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-4 shrink-0 text-xs text-muted-foreground">
                                      {index + 1}
                                    </span>
                                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                                      {getUserInitials(name)}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <span className="font-medium">
                                          {name}
                                        </span>
                                        {isLead ? (
                                          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                                            Current Lead
                                          </span>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2 text-muted-foreground">
                                  {formatAuctionDateTime(b.createdAt)}
                                </td>
                                <td className="py-2 text-right font-semibold tabular-nums">
                                  {formatBidAmount(b.amount)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {liveFeed.length > 5 ? (
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
                    >
                      View All Bids
                      <ChevronRight className="size-4" />
                    </button>
                  ) : null}
                </section>

                {soldSummary ? (
                  <AuctionSoldSummaryCard
                    winnerUserName={soldSummary.winnerUserName}
                    soldAmount={soldSummary.soldAmount}
                  />
                ) : null}
              </div>

              {/* Right column */}
              <div className="space-y-3">
                <SellerAuctionRoomHostControls
                  auctionStatusStr={auctionStatusStr}
                  canInteract={canInteract}
                  isAuctionEnded={isAuctionEnded}
                  actionBusy={actionBusy}
                  actionError={actionError}
                  onPause={onPause}
                  onResume={onResume}
                  onEndConfirmOpen={() => setEndConfirmOpen(true)}
                  allowSendPublicNotification={allowSendPublicNotification}
                  onAuctionStatusOverride={onAuctionStatusOverride}
                  onSendFallbackPublicNotification={
                    onSendFallbackPublicNotification
                  }
                  onMarkAuctionFailed={onMarkAuctionFailed}
                />

                {!isLiveRoom ? (
                  <section className={srCard()}>
                    <h2 className={srSectionTitle()}>
                      Participants ({participants.length})
                    </h2>
                    <ul className="mt-4 space-y-3">
                      {participants.length === 0 ? (
                        <li className="py-4 text-center text-sm text-muted-foreground">
                          No participants yet
                        </li>
                      ) : (
                        participants.slice(0, 4).map((p) => {
                          const bid = getParticipantHighBid(p.userId, liveFeed);
                          return (
                            <li
                              key={p.id}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                                  {getUserInitials(p.userName)}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">
                                    {p.userName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Joined {formatAuctionDateTime(p.joinedAt)}
                                  </p>
                                </div>
                              </div>
                              <span className="shrink-0 text-sm font-semibold tabular-nums">
                                {bid != null ? formatBidAmount(bid) : '—'}
                              </span>
                            </li>
                          );
                        })
                      )}
                    </ul>
                    {participants.length > 4 ? (
                      <button
                        type="button"
                        className="mt-4 text-sm font-medium text-brand-600 hover:underline"
                      >
                        View All Participants
                      </button>
                    ) : null}
                  </section>
                ) : null}

                <section className={srCard()}>
                  <h2 className={srSectionTitle()}>Quick Actions</h2>
                  <ul className="mt-3 divide-y divide-border">
                    {[
                      {
                        href: `/auction/${auctionId}`,
                        label: 'Public View',
                        icon: Eye,
                        external: true,
                      },
                      {
                        href: '#',
                        label: 'Share Auction',
                        icon: Share2,
                        onClick: () => {
                          void navigator.clipboard?.writeText(
                            `${window.location.origin}/auction/${auctionId}`
                          );
                          toast.success('Link copied to clipboard');
                        },
                      },
                      {
                        href: '#',
                        label: 'Download Report',
                        icon: Download,
                        onClick: () =>
                          toast.info('Report download coming soon'),
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      const inner = (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className="size-4 text-brand-600" />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </div>
                          <ArrowUpRight className="size-4 text-muted-foreground" />
                        </>
                      );
                      return (
                        <li key={item.label}>
                          {'onClick' in item && item.onClick ? (
                            <button
                              type="button"
                              onClick={item.onClick}
                              className="flex w-full items-center justify-between py-2 text-left transition-colors hover:text-brand-600"
                            >
                              {inner}
                            </button>
                          ) : (
                            <Link
                              href={item.href}
                              target={item.external ? '_blank' : undefined}
                              className="flex items-center justify-between py-2 transition-colors hover:text-brand-600"
                            >
                              {inner}
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </div>
            </div>
          </div>

          {rightSidebar}
        </div>
      </div>
    </>
  );
}
