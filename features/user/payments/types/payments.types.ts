export type {
  IPaymentGatewayOrder,
  IVerifyGatewayPaymentInput,
} from '@/types/payment-gateway.type';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'DECLINED';

export type PaymentPhase = 'DEPOSIT' | 'BALANCE';

export interface IUserPaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentId: string;
  phase: PaymentPhase;
  dueAt: string;
  createdAt: string;
}

export interface IUserPaymentsPage {
  items: IUserPaymentItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
