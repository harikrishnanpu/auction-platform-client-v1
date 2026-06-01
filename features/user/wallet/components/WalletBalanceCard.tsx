import { Wallet } from 'lucide-react';

import { appCard, appInset } from '@/lib/app-design';
import { cn } from '@/lib/utils';
import type { IUserWallet } from '../types/wallet.types';
import { formatWalletCurrency } from '../utils/format-wallet';

export function WalletBalanceCard({ wallet }: { wallet: IUserWallet }) {
  const totalBalance = wallet.mainBalance + wallet.heldBalance;

  return (
    <div className={appCard()}>
      <h2 className="app-section-title mb-5 flex items-center gap-2">
        <Wallet className="size-4 text-primary" />
        Wallet balance
      </h2>
      <p className="app-stat-value">
        {formatWalletCurrency(totalBalance, wallet.currency)}
      </p>
      <div
        className={cn(
          appInset(),
          'mt-4 space-y-1.5 text-[13px] text-muted-foreground'
        )}
      >
        <p>
          Main balance:{' '}
          <span className="font-medium text-foreground">
            {formatWalletCurrency(wallet.mainBalance, wallet.currency)}
          </span>
        </p>
        <p>
          Held balance:{' '}
          <span className="font-medium text-foreground">
            {formatWalletCurrency(wallet.heldBalance, wallet.currency)}
          </span>
        </p>
      </div>
    </div>
  );
}
