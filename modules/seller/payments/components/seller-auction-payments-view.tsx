'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

import { getSellerAuctionPaymentsAction } from '@/actions/seller/seller.action';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatInr } from '@/utils/format-inr';
import { PaymentDueDate } from '@/modules/user/payments/components/PaymentDueDate';
import { PaymentPhaseBadge } from '@/modules/user/payments/components/PaymentPhaseBadge';
import { PaymentStatusBadge } from '@/modules/user/payments/components/PaymentStatusBadge';
import { PaginationControls } from '@/modules/user/notifications/components/PaginationControls';
import type { PaymentStatus } from '@/modules/user/payments/types/payments.types';
import type { ISellerAuctionPaymentItem } from '@/modules/seller/payments/types/seller-payments.types';
import useKycStore from '@/store/kyc.store';
import { KycStatusEnum } from '@/types/kyc.type';

function shortId(id: string): string {
  if (id.length <= 12) return id;
  return `${id.slice(0, 8)}…${id.slice(-4)}`;
}

function SellerPaymentsList({ items }: { items: ISellerAuctionPaymentItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/70 bg-muted/20 px-4 py-6 text-sm text-muted-foreground">
        No payment requests for your auctions yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-3 rounded-lg border border-border/60 p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium">{formatInr(item.amount)}</p>
              <PaymentPhaseBadge phase={item.phase} />
            </div>
            <p className="text-sm font-medium text-foreground">
              <Link
                href={`/seller/auctions/${item.auctionId}`}
                className="text-primary hover:underline"
              >
                {item.auctionTitle}
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Buyer:{' '}
              <span className="font-mono text-[11px]">
                {shortId(item.buyerUserId)}
              </span>
            </p>
            <PaymentDueDate dueAt={item.dueAt} />
            <p className="text-xs text-muted-foreground">
              Created {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <PaymentStatusBadge status={item.status} />
            <Badge variant="outline" className="text-[10px] font-normal">
              {item.currency}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SellerAuctionPaymentsView() {
  const kycStatus = useKycStore((s) => s.kycStatus);
  const kycStatusEnum = (
    kycStatus === null ? null : (kycStatus as KycStatusEnum)
  ) as KycStatusEnum | null;

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<ISellerAuctionPaymentItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [serverPage, setServerPage] = useState(1);

  const effectiveTotalPages = useMemo(() => totalPages, [totalPages]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (kycStatusEnum !== KycStatusEnum.APPROVED) {
        setItems([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await getSellerAuctionPaymentsAction({
          page,
          limit: 10,
          status,
        });
        if (cancelled) return;
        if (res.success && res.data) {
          setItems(res.data.items);
          setTotalPages(res.data.totalPages);
          setServerPage(res.data.page);
        } else {
          setItems([]);
          setError(res.error ?? 'Failed to load payments');
        }
      } catch (e: unknown) {
        if (cancelled) return;
        setItems([]);
        setError(e instanceof Error ? e.message : 'Failed to load payments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [page, status, kycStatusEnum]);

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-3 py-4 sm:px-4">
      <div className="space-y-1">
        <h1 className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
          <CreditCard className="h-5 w-5" />
          All payments
        </h1>
        <p className="text-sm text-muted-foreground">
          Payment requests for buyers on your auctions: pending, paid, failed,
          or declined.
        </p>
      </div>

      {kycStatusEnum === null ? (
        <div className="rounded-lg border border-border/70 bg-muted/10 px-3 py-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : kycStatusEnum !== KycStatusEnum.APPROVED ? (
        <div className="rounded-lg border border-border/70 bg-muted/10 px-3 py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Verify your seller account to view auction payments.
          </p>
          <Link
            href="/seller/kyc"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Seller KYC
          </Link>
        </div>
      ) : (
        <Card className="border-border/60 bg-card/50">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex justify-end">
              <Select
                value={status}
                onValueChange={(value) => {
                  setPage(1);
                  setStatus(value as PaymentStatus | 'ALL');
                }}
              >
                <SelectTrigger className="h-9 w-[180px] rounded-lg">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Paid</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="DECLINED">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : (
              <>
                <SellerPaymentsList items={items} />
                <PaginationControls
                  page={serverPage}
                  totalPages={effectiveTotalPages}
                  onPrev={() => setPage((p) => Math.max(1, p - 1))}
                  onNext={() =>
                    setPage((p) => Math.min(effectiveTotalPages, p + 1))
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
