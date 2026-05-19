'use client';

import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { appCard } from '@/lib/app-design';

import { WalletAmountDialog } from './WalletAmountDialog';
import type { IUserWallet } from '../types/wallet.types';

type WalletActionsProps = {
  wallet: IUserWallet;
  onAddAmount: (amount: number) => Promise<void>;
  onWithdrawAmount: (amount: number) => Promise<void>;
};

export function WalletActions({
  wallet,
  onAddAmount,
  onWithdrawAmount,
}: WalletActionsProps) {
  const handleAddAmount = async (amount: number) => {
    await onAddAmount(amount);
    toast.info('Opening Razorpay checkout');
  };

  const handleWithdrawAmount = async (amount: number) => {
    if (amount > wallet.mainBalance) {
      toast.error('Insufficient balance');
      return;
    }
    await onWithdrawAmount(amount);
    toast.success('Amount withdrawn from wallet');
  };

  return (
    <div className={appCard()}>
      <h2 className="app-section-title mb-4">Quick actions</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <WalletAmountDialog
          title="Add Amount"
          description="Enter amount to add. Razorpay checkout will open."
          actionLabel="Continue to Payment"
          onSubmit={handleAddAmount}
          trigger={
            <Button type="button" className="w-full rounded-full">
              <ArrowDownToLine className="size-3.5" />
              Add amount
            </Button>
          }
        />
        <WalletAmountDialog
          title="Withdraw Amount"
          description="Enter amount to withdraw from your main balance."
          actionLabel="Withdraw"
          onSubmit={handleWithdrawAmount}
          trigger={
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-full"
            >
              <ArrowUpFromLine className="size-3.5" />
              Withdraw
            </Button>
          }
        />
      </div>
    </div>
  );
}
