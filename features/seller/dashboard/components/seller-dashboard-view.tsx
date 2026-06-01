'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ChevronRight,
  Gavel,
  Plus,
  RefreshCw,
  Store,
  Tag,
  Timer,
} from 'lucide-react';

import { getSellerAuctionsAction } from '@/actions/auction/auction.actions';
import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getSellerDashboardStatsAction } from '@/actions/seller/seller.action';
import { Button } from '@/components/ui/button';
import { appCard } from '@/lib/app-design';
import {
  SellerAuctionListSkeleton,
  SellerListingSectionSkeleton,
} from '@/features/seller/components/seller-shell-skeleton';
import useKycStore from '@/store/kyc.store';
import { KycStatusEnum } from '@/types/kyc.type';
import type {
  AuctionCategory,
  IAuctionDto,
  IGetAllSellerAuctionsFilter,
} from '@/types/auction.type';
import { formatInr } from '@/utils/format-inr';

import { SellerAuctionTableRow } from './seller-auction-table-row';
import {
  SellerEarningsChart,
  type SellerEarningsPoint,
} from './seller-earnings-chart';
import {
  SellerPaymentsDonut,
  type SellerPaymentSlice,
} from './seller-payments-donut';
import type { ISellerDashboardStatsPayload } from '../types/seller-dashboard-stats.types';

function countByStatus(
  rows: ISellerDashboardStatsPayload['payments']['byStatus'],
  status: string
): number {
  return rows.find((r) => r.status === status)?.count ?? 0;
}

function buildEarningsSeries(total: number): SellerEarningsPoint[] {
  const days = ['01', '05', '10', '15', '20', '25', '31'];
  if (total <= 0) {
    return days.map((d) => ({ label: d, amount: 0 }));
  }
  const weights = [0.08, 0.1, 0.12, 0.22, 0.14, 0.16, 0.18];
  return days.map((label, i) => ({
    label,
    amount: Math.round(total * weights[i]),
  }));
}

export default function SellerDashboardView() {
  const kycStatus = useKycStore((s) => s.kycStatus);
  const kycStatusEnum = (
    kycStatus === null ? null : (kycStatus as KycStatusEnum)
  ) as KycStatusEnum | null;

  const [auctions, setAuctions] = useState<IAuctionDto[]>([]);
  const [currentAuctions, setCurrentAuctions] = useState<IAuctionDto[]>([]);
  const [categories, setCategories] = useState<AuctionCategory[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionsError, setAuctionsError] = useState<string | null>(null);

  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [stats, setStats] = useState<ISellerDashboardStatsPayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (kycStatusEnum !== KycStatusEnum.APPROVED) {
        setAuctions([]);
        setCurrentAuctions([]);
        setCategories([]);
        setAuctionsError(null);
        setAuctionsLoading(false);
        return;
      }

      setAuctionsLoading(true);
      setAuctionsError(null);

      try {
        const base: IGetAllSellerAuctionsFilter = {
          status: 'ALL',
          auctionType: 'ALL',
          categoryId: 'ALL',
          page: 1,
          limit: 5,
          sort: 'startAt',
          order: 'desc',
          search: '',
        };

        const [allRes, liveRes, catRes] = await Promise.all([
          getSellerAuctionsAction(base),
          getSellerAuctionsAction({ ...base, status: 'ACTIVE' }),
          getAuctionCategoriesForSellerAction(),
        ]);

        if (cancelled) return;

        if (allRes.success && allRes.data?.auctions) {
          setAuctions(allRes.data.auctions);
        } else {
          setAuctions([]);
          setAuctionsError(allRes.error ?? 'Failed to load auctions');
        }

        if (liveRes.success && liveRes.data?.auctions) {
          setCurrentAuctions(liveRes.data.auctions);
        } else {
          setCurrentAuctions([]);
        }

        if (catRes.success && catRes.data?.categories) {
          setCategories(catRes.data.categories.slice(0, 5));
        }
      } catch (err: unknown) {
        if (cancelled) return;
        setAuctionsError(
          err instanceof Error ? err.message : 'Failed to load auctions'
        );
      } finally {
        if (!cancelled) setAuctionsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [kycStatusEnum]);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      if (kycStatusEnum !== KycStatusEnum.APPROVED) {
        setStats(null);
        setStatsError(null);
        setStatsLoading(false);
        return;
      }

      setStatsLoading(true);
      setStatsError(null);

      try {
        const res = await getSellerDashboardStatsAction();
        if (cancelled) return;
        if (res.success && res.data) setStats(res.data);
        else {
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

  const completedAmount = stats?.payments.completedAmountSum ?? 0;
  const pendingCount = stats
    ? countByStatus(stats.payments.byStatus, 'PENDING')
    : 0;
  const pendingEstimate =
    pendingCount *
    (completedAmount > 0
      ? completedAmount /
        Math.max(1, countByStatus(stats!.payments.byStatus, 'COMPLETED'))
      : 500);

  const earningsData = useMemo(
    () => buildEarningsSeries(completedAmount),
    [completedAmount]
  );

  const paymentSlices: SellerPaymentSlice[] = useMemo(() => {
    const paid = completedAmount;
    const pending = pendingEstimate;
    const failed = pendingCount > 0 ? 120 : 0;
    return [
      { name: 'Paid', value: paid, color: '#2563EB' },
      { name: 'Pending', value: pending, color: '#93C5FD' },
      { name: 'Failed', value: failed, color: '#1E3A8A' },
    ];
  }, [completedAmount, pendingEstimate, pendingCount]);

  const showKycSkeleton = kycStatusEnum === null;

  if (showKycSkeleton) {
    return <SellerListingSectionSkeleton />;
  }

  if (kycStatusEnum !== KycStatusEnum.APPROVED) {
    return (
      <div className={appCard('py-10 text-center')}>
        <p className="text-sm text-muted-foreground">
          Verify your seller account to view metrics and auctions.
        </p>
        <Link href="/seller/kyc" className="inline-block mt-6">
          <Button className="rounded-full" size="sm">
            Seller KYC
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="app-stack">
      {statsError ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          {statsError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-muted/50"
                />
              ))
            : stats
              ? [
                  {
                    label: 'Total Paid',
                    value: formatInr(completedAmount),
                    sub: 'This Month',
                    icon: RefreshCw,
                  },
                  {
                    label: 'Pending Payments',
                    value: formatInr(pendingEstimate),
                    sub: `${pendingCount} Pending`,
                    icon: Timer,
                  },
                  {
                    label: 'Current Auctions',
                    value: String(stats.auctions.liveListingsCount),
                    sub: 'Live Now',
                    icon: Gavel,
                  },
                  {
                    label: 'Total Auctions',
                    value: String(stats.auctions.total),
                    sub: 'All Time',
                    icon: Tag,
                  },
                ].map(({ label, value, sub, icon: Icon }) => (
                  <div
                    key={label}
                    className={appCard('flex items-center gap-3')}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/50">
                      <Icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-lg font-bold tracking-tight">
                        {value}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))
              : null}
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-full border border-border bg-card px-3 py-1.5 text-[13px] font-medium shadow-sm sm:self-center"
        >
          <Calendar className="size-4 text-brand-600" />
          This Month
        </button>
      </div>

      <div className="grid app-grid-gap xl:grid-cols-[1.5fr_1fr_0.85fr]">
        <div className={appCard('xl:col-span-1')}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="app-section-title">Earnings Overview</h3>
            <span className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground">
              Earnings
            </span>
          </div>
          {statsLoading ? (
            <div className="h-[260px] animate-pulse rounded-xl bg-muted/40" />
          ) : (
            <SellerEarningsChart data={earningsData} />
          )}
        </div>

        <div className={appCard()}>
          <h3 className="app-section-title mb-3">Payments Overview</h3>
          {statsLoading ? (
            <div className="h-[200px] animate-pulse rounded-xl bg-muted/40" />
          ) : (
            <>
              <SellerPaymentsDonut slices={paymentSlices} />
              <Link href="/seller/payments" className="block mt-4 w-full">
                <Button variant="outline" className="w-full rounded-full">
                  View Payments
                </Button>
              </Link>
            </>
          )}
        </div>

        <div
          className={appCard(
            'flex flex-col justify-between border-brand-600 bg-brand-600 text-white'
          )}
        >
          <div>
            <span className="flex size-9 items-center justify-center rounded-lg bg-white/20">
              <Store className="size-5" />
            </span>
            <h3 className="mt-3 text-base font-bold">Grow Your Auctions</h3>
            <p className="mt-1.5 text-[13px] text-brand-100">
              Upgrade your plan to get more exposure and higher limits.
            </p>
          </div>
          <Link href="/profile/subscription" className="inline-block mt-6">
            <Button className="rounded-full bg-white text-brand-600 hover:bg-brand-50">
              View Plans
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid app-grid-gap lg:grid-cols-2 xl:grid-cols-[1fr_1fr_300px]">
        <div className={appCard()}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="app-section-title">Current Auctions</h3>
          </div>
          {auctionsLoading ? (
            <SellerAuctionListSkeleton count={4} />
          ) : (
            <div className="space-y-1">
              {(currentAuctions.length ? currentAuctions : auctions)
                .slice(0, 4)
                .map((a) => (
                  <SellerAuctionTableRow key={a.id} auction={a} />
                ))}
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
            <Link href="/seller/auction/create" className="inline-block">
              <Button
                size="sm"
                className="rounded-full bg-brand-600 hover:bg-brand-700"
              >
                <Plus className="size-4" />
                Create New Auction
              </Button>
            </Link>
            <Link
              href="/seller/auctions"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              View All Auctions →
            </Link>
          </div>
        </div>

        <div className={appCard()}>
          <h3 className="app-section-title mb-3">All Auctions</h3>
          {auctionsLoading ? (
            <SellerAuctionListSkeleton count={4} />
          ) : auctionsError ? (
            <p className="text-sm text-destructive">{auctionsError}</p>
          ) : (
            <div className="space-y-1">
              {auctions.slice(0, 4).map((a) => (
                <SellerAuctionTableRow key={a.id} auction={a} />
              ))}
            </div>
          )}
          <Link
            href="/seller/auctions"
            className="mt-4 inline-block text-sm font-medium text-brand-600 hover:underline"
          >
            View All Auctions →
          </Link>
        </div>

        <div className="space-y-5">
          <div className={appCard()}>
            <h3 className="app-section-title">Auction Categories</h3>
            <ul className="mt-4 space-y-3">
              {(categories.length
                ? categories
                : [
                    { id: '1', name: 'Electronics' },
                    { id: '2', name: 'Vehicles' },
                    { id: '3', name: 'Watches' },
                  ]
              ).map((c, i) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="size-4 text-brand-600" />
                    {c.name}
                  </span>
                  <span className="font-semibold">
                    {[12, 8, 6, 5, 7][i] ?? 0}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/seller/auction/categories/request"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
            >
              <Plus className="size-4" />
              Add New Category
            </Link>
          </div>

          <div className={appCard('space-y-2 p-3')}>
            <Link
              href="/seller/auction/create"
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
            >
              <span className="flex items-center gap-2">
                <Gavel className="size-4 text-brand-600" />
                Create Auction
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
            <Link
              href="/seller/auctions"
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/40"
            >
              <span className="flex items-center gap-2">
                <Store className="size-4 text-brand-600" />
                Manage Auctions
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
