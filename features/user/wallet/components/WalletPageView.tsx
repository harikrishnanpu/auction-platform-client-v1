'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  ProfilePageCard,
  ProfilePageShell,
} from '@/features/user/profile/components/profile-page-shell';
import {
  loadRazorpayScript,
  type RazorpayPaymentResponse,
} from '../utils/razorpay';
import type { IUserWallet } from '../types/wallet.types';

import { WalletBalanceCard } from './WalletBalanceCard';
import { WalletActions } from './WalletActions';
import { WalletPaymentStatusModal } from './WalletPaymentStatusModal';
import {
  createWalletTopupOrderAction,
  verifyWalletTopupAction,
  withdrawWalletAction,
} from '@/actions/user/wallet.actions';

type WalletPageViewProps = {
  wallet: IUserWallet | null;
  error: string | null;
};

export function WalletPageView({ wallet, error }: WalletPageViewProps) {
  const router = useRouter();
  const [paymentStatusModal, setPaymentStatusModal] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({
    open: false,
    title: '',
    description: '',
  });

  const showPaymentStatus = (title: string, description: string) => {
    setPaymentStatusModal({ open: true, title, description });
  };

  const refresh = () => {
    router.refresh();
  };

  const onAddAmount = async (amount: number) => {
    const orderRes = await createWalletTopupOrderAction({ amount });
    if (!orderRes.success || !orderRes.data) {
      showPaymentStatus(
        'Payment Error',
        orderRes.error ?? 'Could not start top-up'
      );
      return;
    }
    const order = orderRes.data;
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
      handler: async (
        response: RazorpayPaymentResponse | Record<string, string>
      ) => {
        try {
          const verifyRes = await verifyWalletTopupAction({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });
          if (!verifyRes.success) throw new Error(verifyRes.error ?? undefined);
          showPaymentStatus(
            'Payment Successful',
            'Your wallet has been credited successfully.'
          );
          refresh();
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
    const res = await withdrawWalletAction({ amount });
    if (!res.success) {
      showPaymentStatus('Withdrawal Failed', res.error ?? 'Could not withdraw');
      return;
    }
    refresh();
  };

  if (error) {
    return (
      <ProfilePageShell>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-[13px] text-destructive">
          {error}
        </div>
      </ProfilePageShell>
    );
  }

  if (!wallet) {
    return (
      <ProfilePageShell>
        <ProfilePageCard>
          <p className="text-[13px] text-muted-foreground">
            Wallet data is unavailable.
          </p>
        </ProfilePageCard>
      </ProfilePageShell>
    );
  }

  return (
    <ProfilePageShell>
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
    </ProfilePageShell>
  );
}
