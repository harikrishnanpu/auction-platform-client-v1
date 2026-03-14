export interface AuctionMedia {
  id?: string;
  url: string;
  isPrimary: boolean;
  type?: 'IMAGE' | 'VIDEO';
}

export interface Auction {
  auctionId: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  startPrice: number;
  minIncrement: number;
  startTime: string;
  endTime: string;
  status: 'DRAFT' | 'ACTIVE' | 'ENDED' | 'SOLD' | 'CANCELLED';
  media: AuctionMedia[];
  currentPrice?: number;
  isPaused?: boolean;
  winnerId?: string | null;
  winnerPaymentDeadline?: string | null;
  completionStatus?: string;
  extensionCount?: number;
  antiSnipeThresholdSeconds?: number;
  antiSnipeExtensionSeconds?: number;
  maxExtensions?: number;
  bidCooldownSeconds?: number;
}

export interface Bid {
  id: string;
  auctionId: string;
  userId: string;
  amount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  username?: string;
  userAvatar?: string;
}

export interface Participant {
  id: string;
  auctionId: string;
  userId: string;
  userName?: string;
  joinedAt: string;
  revokedAt?: string | null;
  isOnline?: boolean;
  lastSeen?: string;
  socketId?: string | null;
  user?: {
    user_id: string;
    username: string;
    email: string;
    profile_image?: string | null;
  };
}

export interface AuctionRoomActions {
  placeBid: (amount: number) => Promise<{ success: boolean; message?: string }>;
  sendMessage: (
    text: string
  ) => Promise<{ success: boolean; message?: string }>;
  pauseAuction: () => Promise<{ success: boolean; message?: string }>;
  resumeAuction: () => Promise<{ success: boolean; message?: string }>;
  endAuction: () => Promise<{ success: boolean; message?: string }>;
  revokeUser: (userId: string) => void;
  unrevokeUser: (userId: string) => void;
}

export interface AuctionRoomState {
  auctionId: string;
  auction?: Auction;
  latestBids: Bid[];
  latestMessages: ChatMessage[];
  lastBidTime?: string | null;
  participants?: Participant[];
}
