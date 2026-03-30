'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { WalletBalanceCard } from './WalletBalanceCard';
import { WalletActions } from './WalletActions';
import { useUserWallet } from '../hooks/use-user-wallet';
import {
  loadRazorpayScript,
  type RazorpayPaymentResponse,
} from '../utils/razorpay';
import { WalletPaymentStatusModal } from './WalletPaymentStatusModal';

export function WalletPageView() {
  const [paymentStatusModal, setPaymentStatusModal] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: '',
    description: '',
  });
  const {
    wallet,
    loading,
    error,
    createTopupOrder,
    verifyTopup,
    withdraw,
    refresh,
  } = useUserWallet();

  const showPaymentStatus = (title: string, description: string) => {
    setPaymentStatusModal({ open: true, title, description });
  };

  const onAddAmount = async (amount: number) => {
    const order = await createTopupOrder(amount);
    const loaded = await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {
      showPaymentStatus(
        'Payment Error',
        'Unable to load Razorpay checkout. Please try again.'
      );
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.gatewayKey,
      amount: order.amountInPaise,
      currency: order.currency,
      order_id: order.orderId,
      name: 'Wallet Top-up',
      description: 'Add funds to your wallet',
      handler: async (response: RazorpayPaymentResponse) => {
        try {
          await verifyTopup({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          showPaymentStatus(
            'Payment Successful',
            'Your wallet has been credited successfully.'
          );
          await refresh();
        } catch {
          showPaymentStatus(
            'Verification Failed',
            'Payment was completed, but verification failed. Please contact support.'
          );
        }
      },
      modal: {
        ondismiss: () => {
          showPaymentStatus(
            'Payment Cancelled',
            'You cancelled the payment. No amount was added.'
          );
        },
      },
    });

    razorpay.open();
  };

  const onWithdrawAmount = async (amount: number) => {
    await withdraw(amount);
    await refresh();
  };

  if (loading) {
    return (
      <Card className="border-border/60 bg-card/50">
        <CardContent className="flex items-center justify-center py-12">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
        Wallet data is unavailable.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold sm:text-xl">Wallet</h1>
        <p className="text-sm text-muted-foreground">
          View your current wallet balance and upcoming actions.
        </p>
      </div>
      <WalletBalanceCard wallet={wallet} />
      <WalletActions
        wallet={wallet}
        onAddAmount={onAddAmount}
        onWithdrawAmount={onWithdrawAmount}
      />
      <WalletPaymentStatusModal
        open={paymentStatusModal.open}
        title={paymentStatusModal.title}
        description={paymentStatusModal.description}
        onClose={() =>
          setPaymentStatusModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </section>
  );
}
