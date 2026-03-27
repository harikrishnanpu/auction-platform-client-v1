'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { WalletBalanceCard } from './WalletBalanceCard';
import { WalletActions } from './WalletActions';
import { useUserWallet } from '../hooks/use-user-wallet';

export function WalletPageView() {
  const { wallet, loading, error } = useUserWallet();

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
      <WalletActions />
    </section>
  );
}
