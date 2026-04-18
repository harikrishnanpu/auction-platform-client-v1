'use client';

import { useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PaginationControls } from '@/features/user/notifications/components/PaginationControls';
import { useUserPayments } from '../hooks/use-user-payments';
import { PaymentsList } from './PaymentsList';
import { PaymentStatusModal } from './PaymentStatusModal';
import {
  loadRazorpayScript,
  type RazorpayPaymentResponse,
} from '@/lib/razorpay';
import type { PaymentStatus } from '../types/payments.types';

export function ProfilePaymentsView() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | 'ALL'>('ALL');
  const [payingPaymentId, setPayingPaymentId] = useState<string | null>(null);
  const [decliningPaymentId, setDecliningPaymentId] = useState<string | null>(
    null
  );
  const [modal, setModal] = useState({
    open: false,
    title: '',
    description: '',
  });

  const {
    data,
    loading,
    error,
    createPaymentOrder,
    verifyPayment,
    declinePayment,
    refresh,
  } = useUserPayments({
    page,
    limit: 10,
    status,
  });

  const totalPages = useMemo(() => data?.totalPages ?? 1, [data?.totalPages]);

  const showModal = (title: string, description: string) => {
    setModal({ open: true, title, description });
  };

  const onPayNow = async (paymentId: string) => {
    try {
      setPayingPaymentId(paymentId);
      const order = await createPaymentOrder(paymentId);
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
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            await verifyPayment({
              paymentId: order.paymentId,
              orderId: response.razorpay_order_id,
              gatewayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            showModal('Payment Successful', 'Payment completed successfully.');
            await refresh();
          } catch {
            showModal(
              'Verification Failed',
              'Payment captured but verification failed. Please contact support.'
            );
          }
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
      await declinePayment(paymentId);
      showModal(
        'Payment declined',
        'This payment obligation has been declined.'
      );
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
    <section className="space-y-5">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <CreditCard className="h-5 w-5" />
          Payments
        </h1>
        <p className="text-sm text-muted-foreground">
          View pending, paid, and declined auction payments with due dates and
          phase.
        </p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex justify-end">
            <Select
              value={status}
              onValueChange={(value) => {
                setPage(1);
                setStatus(value as PaymentStatus | 'ALL');
              }}
            >
              <SelectTrigger className="h-9 w-[170px] rounded-lg">
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

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : (
            <>
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
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </>
          )}
        </CardContent>
      </Card>

      <PaymentStatusModal
        open={modal.open}
        title={modal.title}
        description={modal.description}
        onClose={() => setModal((prev) => ({ ...prev, open: false }))}
      />
    </section>
  );
}
