import type {
  PaymentPhase,
  PaymentStatus,
} from '@/features/user/payments/types/payments.types';

export interface ISellerAuctionPaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  phase: PaymentPhase;
  dueAt: string;
  createdAt: string;
  auctionId: string;
  auctionTitle: string;
  buyerUserId: string;
}

export interface ISellerAuctionPaymentsPage {
  items: ISellerAuctionPaymentItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
