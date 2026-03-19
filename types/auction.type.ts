export type AuctionType = 'LONG' | 'LIVE' | 'SEALED';
export type AuctionAssetType = 'IMAGE' | 'VIDEO';
export type AuctionStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';

export interface CreateAuctionInput {
  auctionType: AuctionType;
  title: string;
  description: string;
  categoryId: string;
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
    assetType?: AuctionAssetType;
  }[];
}

export interface IAuctionDto {
  id: string;
  sellerId: string;
  auctionType: AuctionType;
  status: AuctionStatus;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: Date;
  endAt: Date;
  antiSnipSeconds: number;
  maxExtensionCount: number;
  bidCooldownSeconds: number;
  assets?: {
    fileKey: string;
    position?: number;
    assetType?: AuctionAssetType;
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
  rejectionReason?: string;
  submittedBy: string;
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
