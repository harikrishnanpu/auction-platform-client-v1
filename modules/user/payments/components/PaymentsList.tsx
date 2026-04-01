'use client';

import { Button } from '@/components/ui/button';
import { formatInr } from '@/utils/format-inr';
import { PaymentDueDate } from './PaymentDueDate';
import { PaymentPhaseBadge } from './PaymentPhaseBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import type { IUserPaymentItem } from '../types/payments.types';

export function PaymentsList({
  items,
  payingPaymentId,
  decliningPaymentId,
  onPayNow,
  onDecline,
}: {
  items: IUserPaymentItem[];
  payingPaymentId: string | null;
  decliningPaymentId: string | null;
  onPayNow: (paymentId: string) => Promise<void>;
  onDecline: (paymentId: string) => Promise<void>;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
        No payments found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{formatInr(item.amount)}</p>
              <PaymentPhaseBadge phase={item.phase} />
            </div>
            <p className="text-xs text-muted-foreground">
              Auction Ref: {item.referenceId}
            </p>
            <PaymentDueDate dueAt={item.dueAt} />
            <p className="text-xs text-muted-foreground">
              Created {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PaymentStatusBadge status={item.status} />
            {item.status === 'PENDING' ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void onPayNow(item.id)}
                  disabled={payingPaymentId === item.id}
                >
                  {payingPaymentId === item.id ? 'Processing...' : 'Pay'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void onDecline(item.id)}
                  disabled={decliningPaymentId === item.id}
                >
                  {decliningPaymentId === item.id ? 'Declining...' : 'Decline'}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
