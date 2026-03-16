export type AuctionType = 'LONG' | 'LIVE' | 'SEALED';

export interface CreateAuctionInput {
  auctionType: AuctionType;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: string;
  endAt: string;
  antiSnipSeconds: number;
  maxExtensionCount: number;
  bidCooldownSeconds: number;
  assets?: {
    fileKey: string;
    position?: number;
    assetType?: 'IMAGE' | 'VIDEO';
  }[];
}

export interface CreateAuctionOutput {
  id: string;
  sellerId: string;
  auctionType: AuctionType;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: string;
  endAt: string;
  status: string;
  assetCount: number;
}

export interface AuctionAssetForm {
  fileKey: string;
  position?: number;
  assetType?: 'IMAGE' | 'VIDEO';
}

export type AuctionStatus = 'DRAFT' | 'ACTIVE' | 'ENDED' | 'SOLD' | 'CANCELLED';

export interface SellerAuctionListItem {
  id: string;
  sellerId: string;
  auctionType: AuctionType;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: string;
  endAt: string;
  status: AuctionStatus;
  assetCount: number;
  primaryImageKey?: string;
  antiSnipSeconds: number;
  extensionCount: number;
  maxExtensionCount: number;
  bidCooldownSeconds: number;
  winnerId: string | null;
}

export type BrowseAuctionListItem = SellerAuctionListItem;

export interface AuctionAssetDto {
  id: string;
  auctionId: string;
  fileKey: string;
  position: number;
  assetType: string;
}

export interface AuctionDetail {
  id: string;
  sellerId: string;
  auctionType: AuctionType;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: string;
  endAt: string;
  status: AuctionStatus;
  assets: AuctionAssetDto[];
  antiSnipSeconds: number;
  extensionCount: number;
  maxExtensionCount: number;
  bidCooldownSeconds: number;
  winnerId: string | null;
}

export interface AuctionRoomData {
  bids: {
    id: string;
    auctionId: string;
    userId: string;
    amount: number;
    createdAt: string;
  }[];
  participants: {
    id: string;
    auctionId: string;
    userId: string;
    userName: string;
    joinedAt: string;
  }[];
  lastBidTime: string | null;
}

export interface AuctionWithRoom {
  auction: AuctionDetail;
  room: AuctionRoomData;
}

export interface UpdateAuctionInput {
  auctionType?: AuctionType;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: string;
  endAt: string;
  antiSnipSeconds?: number;
  maxExtensionCount?: number;
  bidCooldownSeconds?: number;
}

export interface UpdateAuctionOutput {
  id: string;
  sellerId: string;
  auctionType: AuctionType;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: string;
  endAt: string;
  status: string;
  antiSnipSeconds: number;
  extensionCount: number;
  maxExtensionCount: number;
  bidCooldownSeconds: number;
  winnerId: string | null;
}
