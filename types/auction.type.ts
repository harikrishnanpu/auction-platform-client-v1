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

export interface UpdateAuctionDraftInput {
  auctionType?: AuctionType;
  title: string;
  description: string;
  categoryId: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startAt: string; // ISO datetime string
  endAt: string; // ISO datetime string
  antiSnipSeconds?: number;
  maxExtensionCount?: number;
  bidCooldownSeconds?: number;
  assets?: AuctionAssetForm[];
}

export interface IAuctionDto {
  id: string;
  sellerId: string;
  auctionType: AuctionType;
  status: AuctionStatus;
  title: string;
  description: string;
  category: AuctionCategory;
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

export interface AuctionAssetForm {
  fileKey: string;
  position?: number;
  assetType?: 'IMAGE' | 'VIDEO';
}

export interface IGetAllSellerAuctionsFilter {
  status: AuctionStatus | 'ALL';
  auctionType: AuctionType | 'ALL';
  categoryId: string | 'ALL';
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
}

export interface IGetAllSellerAuctionsResponse {
  auctions: IAuctionDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  currentPage: number;
}

export interface IGetBrowseAuctionsFilter {
  auctionType: AuctionType | 'ALL';
  categoryId: string | 'ALL';
  page: number;
  limit: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
}

export type IGetBrowseAuctionsResponse = IGetAllSellerAuctionsResponse;

export interface IGetMyAuctionsFilter {
  page: number;
  limit: number;
  search: string;
  auctionType: 'ALL' | 'LONG' | 'LIVE' | 'SEALED';
  status:
    | 'ALL'
    | 'DRAFT'
    | 'ACTIVE'
    | 'PAUSED'
    | 'ENDED'
    | 'SOLD'
    | 'CANCELLED';
  sort: string;
  order: 'asc' | 'desc';
}

export type IGetMyAuctionsResponse = IGetAllSellerAuctionsResponse;
