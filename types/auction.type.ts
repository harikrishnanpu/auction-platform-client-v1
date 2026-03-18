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

export enum AuctionCategoryStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface AuctionCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isVerified: boolean;
  isActive: boolean;
  status: AuctionCategoryStatus;
}

export interface AuctionCategoryRequest {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  isActive: boolean;
  isVerified: boolean;
  status: AuctionCategoryStatus;
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
