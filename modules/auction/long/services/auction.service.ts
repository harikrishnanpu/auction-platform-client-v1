import api from '@/lib/axios';
import { Auction, AuctionMedia } from '../types/auction.types';

interface AuctionApiAsset {
  id?: string;
  url?: string;
  position?: number;
  assetType?: string;
  asset_type?: string;
}

interface AuctionApiResponse {
  auctionId?: string;
  id?: string;
  sellerId?: string;
  seller_id?: string;
  title?: string;
  description?: string;
  category?: { name?: string } | string;
  categoryId?: string;
  category_id?: string;
  condition?: { name?: string } | string;
  conditionId?: string;
  condition_id?: string;
  startPrice?: number;
  start_price?: number;
  minBidIncrement?: number;
  min_bid_increment?: number;
  startAt?: string;
  start_at?: string;
  endAt?: string;
  end_at?: string;
  status?: Auction['status'];
  assets?: AuctionApiAsset[];
  currentPrice?: number;
  current_price?: number;
  isPaused?: boolean;
  is_paused?: boolean;
  winnerId?: string | null;
  winner_id?: string | null;
  winnerPaymentDeadline?: string | null;
  winner_payment_deadline?: string | null;
  completionStatus?: string;
  completion_status?: string;
  extensionCount?: number;
  extension_count?: number;
  antiSnipeThresholdSeconds?: number;
  anti_snipe_threshold_seconds?: number;
  antiSnipeExtensionSeconds?: number;
  anti_snipe_extension_seconds?: number;
  maxExtensions?: number;
  max_extensions?: number;
  bidCooldownSeconds?: number;
  bid_cooldown_seconds?: number;
}

const mapAuction = (data: AuctionApiResponse): Auction => {
  const assets = Array.isArray(data.assets) ? data.assets : [];
  const media: AuctionMedia[] = assets.map(
    (asset: AuctionApiAsset, index: number) => ({
      id: asset.id,
      url: asset.url ?? '',
      isPrimary: asset.position === 0 || index === 0,
      type: (asset.assetType ?? asset.asset_type) as AuctionMedia['type'],
    })
  );

  return {
    auctionId: (data.auctionId ?? data.id ?? '') as string,
    sellerId: (data.sellerId ?? data.seller_id ?? '') as string,
    title: data.title ?? '',
    description: data.description ?? '',
    category:
      data.category?.name ??
      data.categoryId ??
      data.category_id ??
      'Uncategorized',
    condition:
      data.condition?.name ??
      data.conditionId ??
      data.condition_id ??
      'Unspecified',
    startPrice: data.startPrice ?? data.start_price ?? 0,
    minIncrement: data.minBidIncrement ?? data.min_bid_increment ?? 0,
    startTime:
      (data.startAt ?? data.start_at)?.toString?.() ??
      data.startAt ??
      data.start_at ??
      '',
    endTime:
      (data.endAt ?? data.end_at)?.toString?.() ??
      data.endAt ??
      data.end_at ??
      '',
    status: (data.status ?? 'DRAFT') as Auction['status'],
    media,
    currentPrice: data.currentPrice ?? data.current_price,
    isPaused: data.isPaused ?? data.is_paused,
    winnerId: data.winnerId ?? data.winner_id ?? null,
    winnerPaymentDeadline:
      data.winnerPaymentDeadline ?? data.winner_payment_deadline ?? null,
    completionStatus: data.completionStatus ?? data.completion_status,
    extensionCount: data.extensionCount ?? data.extension_count,
    antiSnipeThresholdSeconds:
      data.antiSnipeThresholdSeconds ?? data.anti_snipe_threshold_seconds,
    antiSnipeExtensionSeconds:
      data.antiSnipeExtensionSeconds ?? data.anti_snipe_extension_seconds,
    maxExtensions: data.maxExtensions ?? data.max_extensions,
    bidCooldownSeconds: data.bidCooldownSeconds ?? data.bid_cooldown_seconds,
  };
};

export const auctionService = {
  async getActiveAuctions(): Promise<Auction[]> {
    const { data } = await api.get('/auctions/active');
    return Array.isArray(data.data) ? data.data.map(mapAuction) : [];
  },

  async getAuctionById(auctionId: string): Promise<Auction> {
    const { data } = await api.get(`/auctions/${auctionId}`);
    return mapAuction(data.data);
  },

  async getSellerAuctionById(auctionId: string): Promise<Auction> {
    const { data } = await api.get(`/seller/auctions/${auctionId}`);
    return mapAuction(data.data);
  },

  async getSellerAuctions(): Promise<Auction[]> {
    const { data } = await api.get(`/seller/auctions`);
    return Array.isArray(data.data) ? data.data.map(mapAuction) : [];
  },

  async publishAuction(auctionId: string): Promise<void> {
    await api.post(`/seller/auction/${auctionId}/publish`);
  },

  async getUpcomingAuctions(): Promise<Auction[]> {
    const { data } = await api.get('/auctions/upcoming');
    return Array.isArray(data.data) ? data.data.map(mapAuction) : [];
  },
};
