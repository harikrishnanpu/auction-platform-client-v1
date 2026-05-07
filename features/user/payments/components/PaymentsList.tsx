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
  const groupedItems = items.reduce<Record<string, IUserPaymentItem[]>>(
    (acc, item) => {
      const paymentFor = item.paymentFor ?? 'UNKNOWN';
      const referenceId = item.referenceId ?? item.paymentId;
      const key = `${paymentFor}::${referenceId}`;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    },
    {}
  );

  const groupedEntries = Object.values(groupedItems);

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
        No payments found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groupedEntries.map((group) => {
        const primaryItem =
          group.find((item) => item.phase === 'DEPOSIT') ?? group[0];
        const paymentFor = primaryItem.paymentFor ?? 'UNKNOWN';
        const referenceId = primaryItem.referenceId ?? primaryItem.paymentId;

        return (
          <div
            key={`${paymentFor}-${referenceId}`}
            className="space-y-1.5 rounded-lg border border-border/60 p-2.5"
          >
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {paymentFor}
              </p>
              {group.map((item) => (
                <div
                  key={item.id}
                  className="space-y-1 rounded-md border border-border/70 p-2"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">
                      {formatInr(item.amount)}
                    </p>
                    <PaymentPhaseBadge phase={item.phase} />
                  </div>
                  <PaymentDueDate dueAt={item.dueAt} />
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <div className="flex flex-col items-end gap-1">
                      <PaymentStatusBadge status={item.status} />
                      {item.status === 'PENDING' ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => void onPayNow(item.id)}
                            disabled={payingPaymentId === item.id}
                          >
                            {payingPaymentId === item.id
                              ? 'Processing...'
                              : 'Pay'}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => void onDecline(item.id)}
                            disabled={decliningPaymentId === item.id}
                          >
                            {decliningPaymentId === item.id
                              ? 'Declining...'
                              : 'Decline'}
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
