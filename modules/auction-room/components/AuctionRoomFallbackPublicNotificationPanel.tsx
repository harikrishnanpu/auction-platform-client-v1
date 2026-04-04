'use client';

import { useCallback, useState } from 'react';
import { CreditCard, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  loadRazorpayScript,
  type RazorpayPaymentResponse,
} from '@/lib/razorpay';
import type {
  IPaymentGatewayOrder,
  IVerifyGatewayPaymentInput,
} from '@/types/payment-gateway.type';
import { formatAuctionPrice } from '@/utils/auction-utils';

import { AuctionRoomAlert } from './AuctionRoomAlert';
import { AuctionRoomSectionCard } from './AuctionRoomSectionCard';

type AuctionRoomFallbackPublicNotificationPanelProps = {
  auctionId: string;
  auctionTitle?: string;
  startPrice: number;
  canInteract: boolean;
  onStatusUpdated?: (status: string) => void;
  payFallbackPublic?: () => Promise<{
    success: boolean;
    data?: IPaymentGatewayOrder;
    error?: string;
  }>;
  verifyFallbackPublicAuctionPayment?: (
    input: IVerifyGatewayPaymentInput
  ) => Promise<{ success: boolean; data?: unknown; error?: string }>;
  onDecline?: () => Promise<{
    success: boolean;
    data?: unknown;
    error?: string;
  }>;
};

export function AuctionRoomFallbackPublicNotificationPanel({
  auctionId,
  auctionTitle,
  startPrice,
  canInteract,
  onStatusUpdated,
  payFallbackPublic,
  verifyFallbackPublicAuctionPayment,
  onDecline,
}: AuctionRoomFallbackPublicNotificationPanelProps) {
  const [busy, setBusy] = useState<'pay' | 'decline' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runDecline = useCallback(async () => {
    setBusy('decline');
    setError(null);
    const res = await onDecline?.();
    setBusy(null);

    if (res == null) {
      const msg = 'Socket handler not available';
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!res.success) {
      const msg = res.error ?? 'Could not decline';
      setError(msg);
      toast.error(msg);
      return;
    }

    toast.success('You declined the offer');
    const next = (res.data as { status?: string } | undefined)?.status;
    if (next) onStatusUpdated?.(next);
  }, [onDecline, onStatusUpdated]);

  const runPay = useCallback(async () => {
    setBusy('pay');
    setError(null);

    try {
      const res = await payFallbackPublic?.();
      if (res == null) {
        const msg = 'Socket handler not available';
        setError(msg);
        toast.error(msg);
        return;
      }
      if (!res.success || !res.data) {
        const msg = res.error ?? 'Could not start payment';
        setError(msg);
        toast.error(msg);
        return;
      }

      const order = res.data;
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        const msg = 'Unable to load Razorpay checkout';
        setError(msg);
        toast.error(msg);
        return;
      }

      const razorpay = new window.Razorpay({
        key: order.gatewayKey,
        amount: order.amountInPaise,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Auction payment',
        description: auctionTitle?.trim()
          ? `${auctionTitle.trim()} · fallback`
          : `Auction ${auctionId.slice(0, 8)}…`,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            const verify = verifyFallbackPublicAuctionPayment;
            if (!verify) {
              toast.error('Verification handler not available');
              return;
            }
            const ver = await verify({
              paymentId: order.paymentId,
              orderId: response.razorpay_order_id,
              gatewayPaymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            if (!ver.success) {
              toast.error(ver.error ?? 'Payment verification failed');
              return;
            }
            toast.success('Payment completed');
            const next = (ver.data as { status?: string } | undefined)?.status;
            if (next) onStatusUpdated?.(next);
          } catch {
            toast.error(
              'Payment was taken, but verification failed. Contact support if needed.'
            );
          }
        },
        modal: {
          ondismiss: () => toast.message('Payment cancelled'),
        },
      });

      razorpay.open();
    } finally {
      setBusy(null);
    }
  }, [
    auctionId,
    auctionTitle,
    onStatusUpdated,
    payFallbackPublic,
    verifyFallbackPublicAuctionPayment,
  ]);

  const disabled = !canInteract || busy != null;

  return (
    <AuctionRoomSectionCard
      title="Public fallback offer"
      description="Purchase at the start price below, or decline to pass."
    >
      {error ? (
        <AuctionRoomAlert message={error} variant="destructive" />
      ) : null}

      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-muted-foreground">
          Start price:{' '}
          <span className="font-semibold tabular-nums text-foreground">
            {formatAuctionPrice(startPrice)}
          </span>
        </p>
        <div className="flex flex-col gap-1.5 sm:flex-row">
          <Button
            size="sm"
            className="h-8 flex-1 justify-center gap-1.5 rounded-md text-xs"
            disabled={disabled}
            onClick={() => void runPay()}
          >
            <CreditCard className="size-3.5" />
            {busy === 'pay' ? 'Opening checkout…' : 'Pay start price'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 flex-1 justify-center gap-1.5 rounded-md text-xs"
            disabled={disabled}
            onClick={() => void runDecline()}
          >
            <X className="size-3.5" />
            {busy === 'decline' ? 'Sending…' : 'Decline'}
          </Button>
        </div>
      </div>
    </AuctionRoomSectionCard>
  );
}
