import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { IUserWallet } from '../types/wallet.types';
import { formatWalletCurrency } from '../utils/format-wallet';

export function WalletBalanceCard({ wallet }: { wallet: IUserWallet }) {
  const totalBalance = wallet.mainBalance + wallet.heldBalance;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-4 w-4" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-2xl font-semibold sm:text-3xl">
          {formatWalletCurrency(totalBalance, wallet.currency)}
        </p>
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>
            Main Balance:{' '}
            {formatWalletCurrency(wallet.mainBalance, wallet.currency)}
          </p>
          <p>
            Held Balance:{' '}
            {formatWalletCurrency(wallet.heldBalance, wallet.currency)}
          </p>
          <p className="font-medium text-foreground/90">
            Total: {formatWalletCurrency(totalBalance, wallet.currency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
