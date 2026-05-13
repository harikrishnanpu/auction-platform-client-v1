'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Gavel,
  Layers,
  ListOrdered,
  Plus,
  Radio,
} from 'lucide-react';

import { getSellerAuctionsAction } from '@/actions/auction/auction.actions';
import { getSellerDashboardStatsAction } from '@/actions/seller/seller.action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SellerAuctionsCards } from '@/features/seller/auction/components/seller-auctions-cards';
import type { ISellerDashboardStatsPayload } from '@/features/seller/dashboard/types/seller-dashboard-stats.types';
import {
  SellerAuctionListSkeleton,
  SellerListingSectionSkeleton,
} from '@/features/seller/components/seller-shell-skeleton';
import useKycStore from '@/store/kyc.store';
import { KycStatusEnum } from '@/types/kyc.type';
import type {
  IAuctionDto,
  IGetAllSellerAuctionsFilter,
} from '@/types/auction.type';
import { formatInr } from '@/utils/format-inr';

import { SellerDashboardCharts } from './seller-dashboard-charts';
import { SellerMetricCard } from './seller-metric-card';

const AUCTION_STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  ENDED: 'Ended',
  SOLD: 'Sold',
  CANCELLED: 'Cancelled',
  FALLBACK_ENDED: 'Fallback ended',
  FALLBACK_PUBLIC_NOTIFICATION: 'Public notice',
  FAILED: 'Failed',
};

const AUCTION_CHART_ORDER = [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'ENDED',
  'SOLD',
  'CANCELLED',
  'FALLBACK_ENDED',
  'FALLBACK_PUBLIC_NOTIFICATION',
  'FAILED',
];

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  COMPLETED: 'Paid',
  FAILED: 'Failed',
  DECLINED: 'Declined',
};

const PAYMENT_CHART_ORDER = ['PENDING', 'COMPLETED', 'FAILED', 'DECLINED'];

function buildAuctionChartSeries(
  rows: ISellerDashboardStatsPayload['auctions']['byStatus']
) {
  if (rows.length === 0) {
    return [{ label: 'No auctions yet', count: 0 }];
  }
  const map = new Map(rows.map((r) => [r.status, r.count]));
  const out: { label: string; count: number }[] = [];
  for (const key of AUCTION_CHART_ORDER) {
    if (map.has(key)) {
      out.push({
        label: AUCTION_STATUS_LABEL[key] ?? key,
        count: map.get(key)!,
      });
    }
  }
  for (const r of rows) {
    if (!AUCTION_CHART_ORDER.includes(r.status)) {
      out.push({
        label: AUCTION_STATUS_LABEL[r.status] ?? r.status,
        count: r.count,
      });
    }
  }
  return out;
}

function buildPaymentChartSeries(
  rows: ISellerDashboardStatsPayload['payments']['byStatus']
) {
  if (rows.length === 0) {
    return [{ label: 'No payments yet', count: 0 }];
  }
  const map = new Map(rows.map((r) => [r.status, r.count]));
  const out: { label: string; count: number }[] = [];
  for (const key of PAYMENT_CHART_ORDER) {
    if (map.has(key)) {
      out.push({
        label: PAYMENT_STATUS_LABEL[key] ?? key,
        count: map.get(key)!,
      });
    }
  }
  for (const r of rows) {
    if (!PAYMENT_CHART_ORDER.includes(r.status)) {
      out.push({
        label: PAYMENT_STATUS_LABEL[r.status] ?? r.status,
        count: r.count,
      });
    }
  }
  return out;
}

function countByPaymentStatus(
  rows: ISellerDashboardStatsPayload['payments']['byStatus'],
  status: string
): number {
  return rows.find((r) => r.status === status)?.count ?? 0;
}

export default function SellerDashboardView() {
  const kycStatus = useKycStore((s) => s.kycStatus);
  const kycStatusEnum = (
    kycStatus === null ? null : (kycStatus as KycStatusEnum)
  ) as KycStatusEnum | null;

  const [auctions, setAuctions] = useState<IAuctionDto[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionsError, setAuctionsError] = useState<string | null>(null);

  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [stats, setStats] = useState<ISellerDashboardStatsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAuctions() {
      if (kycStatusEnum !== KycStatusEnum.APPROVED) {
        setAuctions([]);
        setAuctionsError(null);
        setAuctionsLoading(false);
        return;
      }

      setAuctionsLoading(true);
      setAuctionsError(null);

      try {
        const filter: IGetAllSellerAuctionsFilter = {
          status: 'ALL',
          auctionType: 'ALL',
          categoryId: 'ALL',
          page: 1,
          limit: 5,
          sort: 'startAt',
          order: 'desc',
          search: '',
        };

        const res = await getSellerAuctionsAction(filter);
        if (cancelled) return;

        if (res.success && res.data?.auctions) {
          setAuctions(res.data.auctions);
        } else {
          setAuctions([]);
          setAuctionsError(res.error ?? 'Failed to load auctions');
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setAuctions([]);
        setAuctionsError(
          err instanceof Error ? err.message : 'Failed to load auctions'
        );
      } finally {
        if (!cancelled) setAuctionsLoading(false);
      }
    }

    loadAuctions();
    return () => {
      cancelled = true;
    };
  }, [kycStatusEnum]);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      if (kycStatusEnum !== KycStatusEnum.APPROVED) {
        setStatsError(null);
        setStatsLoading(false);
        setStats(null);
        return;
      }

      setStatsLoading(true);
      setStatsError(null);

      try {
        const res = await getSellerDashboardStatsAction();
        if (cancelled) return;

        if (res.success && res.data) {
          setStats(res.data);
        } else {
          setStats(null);
          setStatsError(res.error ?? 'Failed to load dashboard stats');
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setStats(null);
        setStatsError(
          err instanceof Error ? err.message : 'Failed to load dashboard stats'
        );
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [kycStatusEnum]);

  const showKycSkeleton = kycStatusEnum === null;

  const auctionSeries = stats
    ? buildAuctionChartSeries(stats.auctions.byStatus)
    : [];
  const paymentSeries = stats
    ? buildPaymentChartSeries(stats.payments.byStatus)
    : [];

  const pendingPayTotal = stats
    ? countByPaymentStatus(stats.payments.byStatus, 'PENDING')
    : 0;
  const completedPayCount = stats
    ? countByPaymentStatus(stats.payments.byStatus, 'COMPLETED')
    : 0;
  const completedAmount = stats?.payments.completedAmountSum ?? 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto w-full max-w-[min(100%,1440px)] space-y-8 px-4 py-6 sm:px-6 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Seller dashboard
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Metrics from your account, recent listings, and payment activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-lg"
            >
              <Link href="/seller/auction/categories">
                <Layers className="size-4" />
                Categories
              </Link>
            </Button>
            <Button asChild size="sm" className="h-9 rounded-lg">
              <Link href="/seller/auction/create">
                <Plus className="size-4" />
                New auction
              </Link>
            </Button>
          </div>
        </header>

        {showKycSkeleton ? (
          <SellerListingSectionSkeleton />
        ) : kycStatusEnum !== KycStatusEnum.APPROVED ? (
          <div className="rounded-xl border border-border bg-muted/25 px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Verify your seller account to view metrics and auctions.
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                {kycStatusEnum ?? '—'}
              </Badge>
            </div>
            <Button asChild className="mt-6 h-9 rounded-lg" size="sm">
              <Link href="/seller/kyc">Seller KYC</Link>
            </Button>
          </div>
        ) : (
          <>
            {statsError ? (
              <p className="text-sm text-amber-700 dark:text-amber-500">
                {statsError}
              </p>
            ) : null}

            {statsLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[104px] animate-pulse rounded-xl border border-border bg-muted/40"
                  />
                ))}
              </div>
            ) : stats ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <SellerMetricCard
                  label="Total auctions"
                  value={stats.auctions.total}
                  hint="All statuses"
                  icon={Gavel}
                />
                <SellerMetricCard
                  label="Live listings"
                  value={stats.auctions.liveListingsCount}
                  hint="Active or paused, visible to buyers"
                  icon={Radio}
                />
                <SellerMetricCard
                  label="Pending payments"
                  value={pendingPayTotal}
                  hint="Buyer payment requests"
                  icon={ListOrdered}
                />
                <SellerMetricCard
                  label="Collected (paid)"
                  value={formatInr(completedAmount)}
                  hint={`${completedPayCount} completed payment${completedPayCount === 1 ? '' : 's'}`}
                  icon={CreditCard}
                />
              </div>
            ) : null}

            {statsLoading ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="h-[292px] animate-pulse rounded-xl border border-border bg-muted/40" />
                <div className="h-[292px] animate-pulse rounded-xl border border-border bg-muted/40" />
              </div>
            ) : stats ? (
              <SellerDashboardCharts
                auctionSeries={auctionSeries}
                paymentSeries={paymentSeries}
              />
            ) : null}

            <section className="rounded-xl border border-border bg-muted/15">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-5">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-foreground">
                    Recent auctions
                  </h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Latest five by start time.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg"
                >
                  <Link href="/seller/auctions">View all auctions</Link>
                </Button>
              </div>

              <div className="p-4 sm:p-5">
                {auctionsLoading ? (
                  <SellerAuctionListSkeleton count={5} />
                ) : auctionsError ? (
                  <div className="rounded-lg border border-destructive/25 bg-destructive/5 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-destructive">
                      {auctionsError}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Refresh the page and try again.
                    </p>
                  </div>
                ) : (
                  <SellerAuctionsCards
                    auctions={auctions}
                    limit={5}
                    sortMode="none"
                    emptyAction={
                      <Button asChild className="h-9 rounded-lg" size="sm">
                        <Link href="/seller/auction/create">
                          Create auction
                        </Link>
                      </Button>
                    }
                  />
                )}
              </div>
            </section>

            <div className="flex flex-wrap justify-end gap-2 pb-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-9 rounded-lg"
              >
                <Link href="/seller/payments">Payment history</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
