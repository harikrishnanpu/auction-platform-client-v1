'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatAuctionPrice } from '@/utils/auction-utils';
import { formatWalletCurrency } from '@/modules/user/wallet/utils/format-wallet';

type AuctionPlaceBidTermsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  depositAmount: number;
  walletMain: number | null;
  walletCurrency: string;
  canInteract: boolean;
  lockBusy: boolean;
  onLockAmount: () => void;
};

export function AuctionPlaceBidTermsModal({
  open,
  onOpenChange,
  depositAmount,
  walletMain,
  walletCurrency,
  canInteract,
  lockBusy,
  onLockAmount,
}: AuctionPlaceBidTermsModalProps) {
  const hasWallet =
    walletMain != null &&
    Number.isFinite(walletMain) &&
    walletMain >= depositAmount;

  const lockDisabled = lockBusy || !canInteract || !hasWallet;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join this auction to bid</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Before you can place a bid, you must agree to the auction rules:
              </p>
              <ul className="list-inside list-disc space-y-1.5 text-foreground/90">
                <li>Bids are binding once placed.</li>
                <li>Follow the seller&apos;s terms and platform policies.</li>
                <li>
                  You must lock a deposit of{' '}
                  <span className="font-semibold text-foreground">
                    {formatAuctionPrice(depositAmount, walletCurrency)}
                  </span>{' '}
                  (10% of the auction start price). This amount must be
                  available in your wallet as main balance.
                </li>
              </ul>
              <p>
                Wallet (main):{' '}
                {walletMain == null ? (
                  <span className="text-muted-foreground">Loading…</span>
                ) : (
                  <span className="font-medium text-foreground">
                    {formatWalletCurrency(walletMain, walletCurrency)}
                  </span>
                )}
              </p>
              {!hasWallet && walletMain != null ? (
                <p className="text-destructive">
                  Add funds so your main balance covers the deposit to continue.
                </p>
              ) : null}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={lockBusy}
          >
            Close
          </Button>
          <Button
            type="button"
            disabled={lockDisabled}
            onClick={() => onLockAmount()}
          >
            {lockBusy ? 'Locking…' : 'Lock amount'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
