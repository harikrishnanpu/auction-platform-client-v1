'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  Gavel,
  Headphones,
  IndianRupee,
  MapPin,
  Maximize2,
  Package,
  Shield,
  Tag,
  User,
} from 'lucide-react';

import type { IAuctionDto, AuctionType } from '@/types/auction.type';
import type {
  IAuctionRoomAutoBidConfig,
  IAuctionRoomBid,
  IAuctionRoomChatMessage,
  IAuctionRoomParticipant,
} from '@/types/auctionRoom.types';
import type {
  IPaymentGatewayOrder,
  IVerifyGatewayPaymentInput,
} from '@/types/payment-gateway.type';
import { cn } from '@/lib/utils';
import {
  auctionStatusLabel,
  formatAuctionDateTime,
  getAuctionCategoryName,
  getAuctionTypeLabel,
} from '@/utils/auction-utils';

import { AuctionRoomAlert } from '../AuctionRoomAlert';
import { AuctionRoomAutoBidPanel } from '../AuctionRoomAutoBidPanel';
import { AuctionRoomFallbackPublicNotificationPanel } from '../AuctionRoomFallbackPublicNotificationPanel';
import { AuctionSoldSummaryCard } from '../AuctionSoldSummaryCard';
import {
  getAuctionMediaItems,
  type UserBidStanding,
} from '../../utils/auction-room.utils';

import type { RemoteStreamItem } from '@/types/auctionRoom.types';

import { UserAuctionRoomBidHistory } from './UserAuctionRoomBidHistory';
import { UserAuctionRoomBidPanel } from './UserAuctionRoomBidPanel';
import { UserAuctionRoomChat } from './UserAuctionRoomChat';
import { UserAuctionRoomLiveSidebar } from './UserAuctionRoomLiveSidebar';
import { UserAuctionRoomLiveStream } from './UserAuctionRoomLiveStream';
import { urCard, urPage, urSectionTitle } from './user-room-ui';
import {
  formatAuctionEndHint,
  formatAuctionNumberDisplay,
  formatBidAmount,
  getBidderName,
} from '../seller-room/seller-room-helpers';
import { UserAuctionRoomAllBidsModal } from './UserAuctionRoomAllBidsModal';

function getUserBidStandingLabel(standing: UserBidStanding | null): string {
  if (!standing) return '—';
  const labels: Record<UserBidStanding, string> = {
    winning: 'Leading',
    outbid: 'Outbid',
    watching: 'Watching',
    no_bids_yet: 'Watching',
    sealed_invite: 'Sealed — place bid',
    sealed_placed: 'Bid placed',
    live_soon: 'Live soon',
    need_join: 'Join to bid',
  };
  return labels[standing];
}

function DetailRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-brand-600">{icon}</span>
        {label}
      </div>
      <span
        className={cn(
          'text-right text-xs font-medium text-foreground',
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  );
}

export type UserAuctionRoomLayoutProps = {
  auctionId: string;
  auction: IAuctionDto | null;
  auctionStatusStr: string | null;
  endCountdown: string | null;
  isAuctionActive: boolean;
  isAuctionEnded: boolean;
  isLiveRoom: boolean;
  isSealedRoom: boolean;
  currentBid: IAuctionRoomBid | null;
  nextBidMin: number | null;
  liveFeed: IAuctionRoomBid[];
  participants: IAuctionRoomParticipant[];
  chatMessages: IAuctionRoomChatMessage[];
  chatDraft: string;
  onChatDraftChange: (value: string) => void;
  onSendChat: () => void;
  canInteract: boolean;
  connectionState: string;
  roomReady: boolean;
  error: string | null;
  userBidStanding: UserBidStanding | null;
  watchingCount: number;
  bidCount: number;
  extensionsUsed: number;
  cooldownRemainingSeconds: number;
  isAutoBidActive: boolean;
  autoBidConfig: IAuctionRoomAutoBidConfig | null;
  onPlaceBid: (amount: number) => Promise<{
    success: boolean;
    error?: string;
    nextBidMin?: number | null;
  }>;
  setAutoBidConfig: (config: {
    maxBidAmount: number;
    strategy: 'SLOW' | 'FASTER' | 'SNIPER';
  }) => Promise<{ success: boolean; error?: string }>;
  disableAutoBidConfig: () => Promise<{ success: boolean; error?: string }>;
  soldSummary?: {
    winnerUserName: string;
    soldAmount: number;
  } | null;
  canReportAuction: boolean;
  onReportAuction: () => void;
  currentUserId?: string | null;
  onReportParticipant?: (input: {
    targetedUserId: string;
    reason: string;
    category: 'AUCTION_FRAUD_CRITICAL' | 'PAYMENT_CRITICAL' | 'OTHER';
    level: 'LOW' | 'MEDIUM' | 'CRITICAL';
  }) => Promise<void>;
  onAuctionStatusOverride?: (status: string) => void;
  payFallbackPublic?: () => Promise<{
    success: boolean;
    data?: IPaymentGatewayOrder;
    error?: string;
  }>;
  verifyFallbackPublicAuctionPayment?: (
    input: IVerifyGatewayPaymentInput
  ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  onDeclineFallbackPublic?: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
  remoteStreams?: RemoteStreamItem[];
  localStream?: MediaStream | null;
  isHostProducer?: boolean;
};

export function UserAuctionRoomLayout({
  auctionId,
  auction,
  auctionStatusStr,
  endCountdown,
  isAuctionActive,
  isAuctionEnded,
  isLiveRoom,
  isSealedRoom,
  currentBid,
  nextBidMin,
  liveFeed,
  participants,
  chatMessages,
  chatDraft,
  onChatDraftChange,
  onSendChat,
  canInteract,
  error,
  userBidStanding,
  watchingCount,
  bidCount,
  extensionsUsed,
  cooldownRemainingSeconds,
  isAutoBidActive,
  autoBidConfig,
  onPlaceBid,
  setAutoBidConfig,
  disableAutoBidConfig,
  soldSummary,
  canReportAuction,
  onReportAuction,
  currentUserId,
  onReportParticipant,
  onAuctionStatusOverride,
  payFallbackPublic,
  verifyFallbackPublicAuctionPayment,
  onDeclineFallbackPublic,
  remoteStreams = [],
  localStream = null,
  isHostProducer = false,
}: UserAuctionRoomLayoutProps) {
  const [showMaxBidPanel, setShowMaxBidPanel] = useState(false);
  const [allBidsOpen, setAllBidsOpen] = useState(false);

  const mediaItems = auction ? getAuctionMediaItems(auction) : [];
  const heroImage = mediaItems[0]?.url;
  const categoryName = auction ? getAuctionCategoryName(auction) : '—';
  const typeLabel = auction
    ? getAuctionTypeLabel(auction.auctionType as AuctionType)
    : '—';
  const statusLabel = auctionStatusStr
    ? auctionStatusLabel(auctionStatusStr)
    : '—';
  const isLive = auctionStatusStr === 'ACTIVE' || auctionStatusStr === 'LIVE';
  const isCategoryVerified = Boolean(auction?.category?.isVerified);
  const leadName = currentBid
    ? getBidderName(currentBid.userId, participants)
    : null;
  const currentLeadUserId = currentBid?.userId ?? null;

  const sellerName = useMemo(() => {
    if (!auction?.sellerId) return 'Seller';
    return (
      participants.find((p) => p.userId === auction.sellerId)?.userName ??
      'Seller'
    );
  }, [auction, participants]);

  const maxExtensions = auction?.maxExtensionCount ?? 0;
  const extensionsLabel = `${Math.min(Math.max(0, extensionsUsed), Math.max(0, maxExtensions))}/${maxExtensions}`;
  const standingLabel = getUserBidStandingLabel(userBidStanding);

  const itemBullets = useMemo(() => {
    if (!auction) return [];
    return [
      { label: 'Condition', value: auction.condition || '—' },
      { label: 'Category', value: categoryName },
      { label: 'Auction type', value: typeLabel },
    ].filter((row) => row.value && row.value !== '—');
  }, [auction, categoryName, typeLabel]);

  const productTitleBlock = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {isLive ? (
          <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            Live
          </span>
        ) : (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {statusLabel}
          </span>
        )}
        <span className="text-[11px] font-medium text-muted-foreground">
          {formatAuctionNumberDisplay(auction)}
        </span>
      </div>

      <div className="mt-1.5 flex flex-wrap items-start gap-2">
        <h1 className="text-base font-semibold leading-snug text-foreground sm:text-lg">
          {auction?.title ?? 'Loading auction…'}
        </h1>
        {isCategoryVerified ? (
          <BadgeCheck
            className="size-5 shrink-0 text-brand-600"
            aria-label="Verified category"
          />
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          {categoryName}
        </span>
        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
          {typeLabel}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-3.5 text-brand-600" />
          <span className="font-medium text-foreground">
            {watchingCount}
          </span>{' '}
          watching
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Gavel className="size-3.5 text-brand-600" />
          <span className="font-medium text-foreground">{bidCount}</span>{' '}
          {bidCount === 1 ? 'bid' : 'bids'}
        </span>
      </div>
    </>
  );

  const liveStatsCards = (
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
    </div>
  );

  const statsCards = (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl border border-border/80 bg-[#f0f4fb] p-3 dark:bg-muted/30">
        <p className="text-[11px] font-medium text-muted-foreground">
          Time Left
        </p>
        <p className="mt-1 text-xl font-bold tabular-nums text-brand-600 sm:text-2xl">
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
        <p className="mt-1 text-xl font-bold tabular-nums text-brand-600 sm:text-2xl">
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
    </div>
  );

  const liveNotice = isLiveRoom ? (
    <div className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100">
      <span className="font-semibold">Live auction:</span> All bids are final
      and binding.
    </div>
  ) : null;

  const bidSection = (
    <>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-3">
          <UserAuctionRoomBidPanel
            auctionId={auctionId}
            auction={auction}
            currentBidAmount={currentBid?.amount ?? null}
            nextBidMin={nextBidMin}
            isAuctionEnded={isAuctionEnded}
            isAuctionActive={isAuctionActive}
            canInteract={canInteract}
            isAutoBidActive={isAutoBidActive}
            autoBidConfig={autoBidConfig}
            cooldownRemainingSeconds={cooldownRemainingSeconds}
            onPlaceBid={onPlaceBid}
            onSetMaxBid={() => setShowMaxBidPanel((v) => !v)}
          />
          {showMaxBidPanel && !isSealedRoom ? (
            <AuctionRoomAutoBidPanel
              config={autoBidConfig}
              nextBidMin={nextBidMin}
              canInteract={canInteract}
              isAuctionActive={isAuctionActive}
              isLiveAuction={isLiveRoom}
              onEnable={setAutoBidConfig}
              onDisable={disableAutoBidConfig}
            />
          ) : null}
        </div>

        <UserAuctionRoomBidHistory
          bids={liveFeed}
          participants={participants}
          currentLeadUserId={currentLeadUserId}
          onViewAll={() => setAllBidsOpen(true)}
        />
      </div>
    </>
  );

  const detailsSection = (
    <div className="grid gap-3 min-[1180px]:grid-cols-3">
      <section className={urCard()}>
        <h2 className={urSectionTitle()}>Auction Details</h2>
        <div className="mt-3 divide-y divide-border">
          <DetailRow
            icon={<Calendar className="size-4" />}
            label="Starts"
            value={
              auction?.startAt ? formatAuctionDateTime(auction.startAt) : '—'
            }
          />
          <DetailRow
            icon={<Clock className="size-4" />}
            label="Ends"
            value={auction?.endAt ? formatAuctionDateTime(auction.endAt) : '—'}
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
            icon={<User className="size-4" />}
            label="Seller"
            value={
              <span className="inline-flex items-center justify-end gap-1">
                {sellerName}
                {isCategoryVerified ? (
                  <BadgeCheck className="size-3.5 text-brand-600" />
                ) : null}
              </span>
            }
          />
        </div>
        <Link
          href={`/auction/${auctionId}`}
          target="_blank"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
        >
          View Item Details
          <ArrowUpRight className="size-4" />
        </Link>
      </section>

      <section className={urCard()}>
        <h2 className={urSectionTitle()}>Item Description</h2>
        <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {auction?.description?.trim() || 'No description provided.'}
        </p>
        {itemBullets.length > 0 ? (
          <ul className="mt-3 space-y-1.5 text-xs text-foreground">
            {itemBullets.map((row) => (
              <li key={row.label} className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>
                  <span className="font-medium">{row.label}:</span> {row.value}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
        <Link
          href={`/auction/${auctionId}`}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
        >
          Read More
          <ChevronRight className="size-3.5" />
        </Link>
      </section>

      <section className={urCard()}>
        <h2 className={urSectionTitle()}>Auction Info</h2>
        <div className="mt-3 divide-y divide-border">
          <DetailRow
            icon={<Clock className="size-4" />}
            label="Extensions"
            value={extensionsLabel}
          />
          <DetailRow
            icon={<Shield className="size-4" />}
            label="Fallback Window"
            value={auction != null ? `${auction.antiSnipSeconds}s` : '—'}
          />
          <DetailRow
            icon={<Eye className="size-4" />}
            label="Watchers"
            value={String(watchingCount)}
          />
          <DetailRow
            icon={<Gavel className="size-4" />}
            label="Bids Placed"
            value={String(bidCount)}
          />
          <DetailRow
            icon={<User className="size-4" />}
            label="Your Status"
            value={standingLabel}
            valueClassName="font-semibold text-brand-600"
          />
        </div>
        {canReportAuction && !isLiveRoom ? (
          <button
            type="button"
            onClick={onReportAuction}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline"
          >
            <Flag className="size-3.5" /> Report Auction
          </button>
        ) : null}
      </section>
    </div>
  );

  const footerBanners = (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex gap-3 rounded-xl border border-border/80 bg-brand-50/50 p-3.5 dark:bg-brand-950/20">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
          <Shield className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Bid with confidence
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            All bids are legally binding. Funds are held securely until the
            auction closes and payment is verified.
          </p>
        </div>
      </div>
      <div className="flex gap-3 rounded-xl border border-border/80 bg-muted/30 p-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
          <Headphones className="size-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Need help?</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Questions about bidding or payment?{' '}
            <Link
              href="/help"
              className="font-semibold text-brand-600 hover:underline"
            >
              Visit Help Center
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  const rightSidebar = isLiveRoom ? (
    <UserAuctionRoomLiveSidebar
      className="w-full min-[1320px]:w-[300px] min-[1320px]:shrink-0"
      sellerId={auction?.sellerId}
      heroImageUrl={heroImage}
      messages={chatMessages}
      draft={chatDraft}
      onDraftChange={onChatDraftChange}
      onSend={onSendChat}
      canInteract={canInteract}
      participants={participants}
      currentLeadUserId={currentLeadUserId}
      currentUserId={currentUserId}
      canReportAuction={canReportAuction}
      onReportAuction={onReportAuction}
      onReportParticipant={onReportParticipant}
    />
  ) : (
    <UserAuctionRoomChat
      className="w-full min-[1320px]:w-[252px] min-[1320px]:shrink-0"
      messages={chatMessages}
      draft={chatDraft}
      onDraftChange={onChatDraftChange}
      onSend={onSendChat}
      canInteract={canInteract}
      participantsCount={participants.length}
      currentLeadUserId={currentLeadUserId}
    />
  );

  return (
    <div className={cn(urPage(), 'w-full min-w-0')}>
      {error ? (
        <AuctionRoomAlert message={error} className={cn(urCard(), 'mb-4')} />
      ) : null}
      <div className="flex flex-col gap-3 min-[1320px]:flex-row min-[1320px]:items-start min-[1320px]:gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          {isLiveRoom ? (
            <section className={urCard('overflow-hidden p-0')}>
              <div className="flex flex-col gap-4 p-3.5 sm:p-4 lg:flex-row lg:items-stretch lg:gap-5">
                <UserAuctionRoomLiveStream
                  className="min-w-0 flex-[1.35] lg:max-w-[58%]"
                  remoteStreams={remoteStreams}
                  localStream={localStream}
                  isHostProducer={isHostProducer}
                  watchingCount={watchingCount}
                  isLive={isLive}
                  messages={chatMessages}
                  chatDraft={chatDraft}
                  onChatDraftChange={onChatDraftChange}
                  onSendChat={onSendChat}
                  canInteract={canInteract}
                  hostUserId={auction?.sellerId}
                  currentLeadUserId={currentLeadUserId}
                  heroImageUrl={heroImage}
                  auctionTitle={auction?.title}
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-4 lg:max-w-[42%]">
                  {productTitleBlock}
                  <div className="flex flex-col gap-3">{liveStatsCards}</div>
                </div>
              </div>
            </section>
          ) : (
            <section className={urCard('overflow-hidden p-0')}>
              <div className="flex flex-col gap-4 p-3.5 sm:p-4 min-[1100px]:flex-row min-[1100px]:items-stretch min-[1100px]:gap-5">
                <div className="flex min-w-0 flex-1 flex-col gap-4 min-[1100px]:flex-row min-[1100px]:gap-4">
                  <div className="relative mx-auto aspect-[4/3] w-full max-w-[280px] shrink-0 overflow-hidden rounded-xl bg-muted sm:max-w-[320px] min-[1100px]:mx-0 min-[1100px]:w-[200px] min-[1100px]:max-w-none min-[1180px]:w-[240px]">
                    {heroImage ? (
                      <Image
                        src={heroImage}
                        alt={auction?.title ?? 'Auction item'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1100px) 320px, 240px"
                        priority
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground">
                        <Package className="size-12" />
                      </div>
                    )}
                    {isLive ? (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                        Live
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-lg bg-background/90 text-foreground shadow-sm backdrop-blur-sm"
                      aria-label="Expand image"
                    >
                      <Maximize2 className="size-4" />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">{productTitleBlock}</div>
                </div>
                <div className="w-full shrink-0 min-[1100px]:min-w-[220px] min-[1180px]:min-w-[260px]">
                  {statsCards}
                </div>
              </div>
            </section>
          )}
          {liveNotice}
          {bidSection}
          {soldSummary ? (
            <AuctionSoldSummaryCard
              winnerUserName={soldSummary.winnerUserName}
              soldAmount={soldSummary.soldAmount}
            />
          ) : null}
          {auctionStatusStr === 'FALLBACK_PUBLIC_NOTIFICATION' && auction ? (
            <AuctionRoomFallbackPublicNotificationPanel
              auctionId={auctionId}
              auctionTitle={auction.title}
              startPrice={auction.startPrice}
              canInteract={canInteract}
              onStatusUpdated={onAuctionStatusOverride}
              payFallbackPublic={payFallbackPublic}
              verifyFallbackPublicAuctionPayment={
                verifyFallbackPublicAuctionPayment
              }
              onDecline={onDeclineFallbackPublic}
            />
          ) : null}
          {detailsSection}
          {footerBanners}
        </div>
        {rightSidebar}
      </div>

      <UserAuctionRoomAllBidsModal
        open={allBidsOpen}
        onOpenChange={setAllBidsOpen}
        auctionId={auctionId}
        auction={auction}
        participants={participants}
        currentLeadUserId={currentLeadUserId}
      />
    </div>
  );
}
