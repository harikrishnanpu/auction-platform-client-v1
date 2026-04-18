'use client';

import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
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
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <WalletAmountDialog
          title="Add Amount"
          description="Enter amount to add. Razorpay checkout will open."
          actionLabel="Continue to Payment"
          onSubmit={handleAddAmount}
          trigger={
            <Button type="button" className="w-full">
              <ArrowDownToLine className="h-4 w-4" />
              Add Amount
            </Button>
          }
        />
        <WalletAmountDialog
          title="Withdraw Amount"
          description="Enter amount to withdraw from your main balance."
          actionLabel="Withdraw"
          onSubmit={handleWithdrawAmount}
          trigger={
            <Button type="button" variant="outline" className="w-full">
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw Amount
            </Button>
          }
        />
      </CardContent>
    </Card>
  );
}
