'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  createPaymentOrderAction,
  declinePaymentAction,
  verifyPaymentAction,
} from '@/actions/user/payments.actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationControls } from '@/features/user/notifications/components/PaginationControls';
import {
  ProfilePageCard,
  ProfilePageShell,
} from '@/features/user/profile/components/profile-page-shell';
import {
  loadRazorpayScript,
  type RazorpayPaymentResponse,
} from '@/lib/razorpay';

import { PaymentsList } from './PaymentsList';
import { PaymentStatusModal } from './PaymentStatusModal';
import type { IUserPaymentsPage, PaymentStatus } from '../types/payments.types';

type ProfilePaymentsViewProps = {
  page: number;
  limit: number;
  status: PaymentStatus | 'ALL';
  data: IUserPaymentsPage | null;
  error: string | null;
};

export function ProfilePaymentsView({
  page,
  status,
  data,
  error,
}: ProfilePaymentsViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [payingPaymentId, setPayingPaymentId] = useState<string | null>(null);
  const [decliningPaymentId, setDecliningPaymentId] = useState<string | null>(
    null
  );
  const [modal, setModal] = useState({
    open: false,
    title: '',
    description: '',
  });

  const totalPages = data?.totalPages ?? 1;

  const refresh = () => router.refresh();

  function navigate(nextPage: number, nextStatus: PaymentStatus | 'ALL') {
    const q = new URLSearchParams();
    if (nextPage > 1) q.set('page', String(nextPage));
    if (nextStatus !== 'ALL') q.set('status', nextStatus);
    const query = q.toString();
    startTransition(() => {
      router.push(query ? `/profile/payments?${query}` : '/profile/payments');
    });
  }

  const showModal = (title: string, description: string) => {
    setModal({ open: true, title, description });
  };

  const onPayNow = async (paymentId: string) => {
    try {
      setPayingPaymentId(paymentId);
      const orderRes = await createPaymentOrderAction({ paymentId });
      if (!orderRes.success || !orderRes.data) {
        showModal('Payment Error', orderRes.error ?? 'Unable to start payment');
        return;
      }
      const order = orderRes.data;
      const loaded = await loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        showModal('Payment Error', 'Unable to load Razorpay checkout.');
        return;
      }

      const razorpay = new window.Razorpay({
        key: order.gatewayKey,
        amount: order.amountInPaise,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Auction Payment',
        description: `Payment request ${order.paymentId}`,
        handler: (
          response: Record<string, string> | RazorpayPaymentResponse
        ) => {
          void (async () => {
            const r = response as RazorpayPaymentResponse;
            try {
              const verifyRes = await verifyPaymentAction({
                paymentId: order.paymentId,
                orderId: r.razorpay_order_id,
                gatewayPaymentId: r.razorpay_payment_id,
                signature: r.razorpay_signature,
              });
              if (!verifyRes.success)
                throw new Error(verifyRes.error ?? undefined);
              showModal(
                'Payment Successful',
                'Payment completed successfully.'
              );
              refresh();
            } catch {
              showModal(
                'Verification Failed',
                'Payment captured but verification failed. Please contact support.'
              );
            }
          })();
        },
        modal: {
          ondismiss: () => {
            showModal(
              'Payment Cancelled',
              'Payment was cancelled and remains pending.'
            );
          },
        },
      });

      razorpay.open();
    } catch {
      showModal('Payment Error', 'Unable to start payment. Please try again.');
    } finally {
      setPayingPaymentId(null);
    }
  };

  const onDecline = async (paymentId: string) => {
    try {
      setDecliningPaymentId(paymentId);
      const res = await declinePaymentAction({ paymentId });
      if (!res.success) throw new Error(res.error ?? undefined);
      showModal(
        'Payment declined',
        'This payment obligation has been declined.'
      );
      refresh();
    } catch {
      showModal(
        'Decline failed',
        'Unable to decline this payment. Please try again.'
      );
    } finally {
      setDecliningPaymentId(null);
    }
  };

  return (
    <ProfilePageShell>
      <ProfilePageCard>
        <div className="mb-4 flex justify-end">
          <Select
            value={status}
            onValueChange={(value) => {
              navigate(1, value as PaymentStatus | 'ALL');
            }}
          >
            <SelectTrigger className="h-8 w-[160px] rounded-lg text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Paid</SelectItem>
              <SelectItem value="DECLINED">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isPending ? (
          <p className="py-12 text-center text-[13px] text-muted-foreground">
            Loading…
          </p>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13px] text-destructive">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            <PaymentsList
              items={data?.items ?? []}
              payingPaymentId={payingPaymentId}
              decliningPaymentId={decliningPaymentId}
              onPayNow={onPayNow}
              onDecline={onDecline}
            />
            <PaginationControls
              page={data?.page ?? page}
              totalPages={totalPages}
              onPrev={() => navigate(Math.max(1, page - 1), status)}
              onNext={() => navigate(Math.min(totalPages, page + 1), status)}
            />
          </div>
        )}
      </ProfilePageCard>

      <PaymentStatusModal
        open={modal.open}
        title={modal.title}
        description={modal.description}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
    </ProfilePageShell>
  );
}
