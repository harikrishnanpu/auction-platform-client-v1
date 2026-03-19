'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Gavel, Layers, Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SellerAuctionsSimpleTable } from '@/modules/seller/auction/components/seller-auctions-simple-table';
import useKycStore from '@/store/kyc.store';
import { KycStatusEnum } from '@/types/kyc.type';
import type { IAuctionDto } from '@/types/auction.type';
import { getSellerAuctionsAction } from '@/actions/auction/auction.actions';

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-lg bg-muted p-2">
              {icon}
            </span>
            <CardTitle className="text-base">{label}</CardTitle>
          </div>
          <Badge variant="outline">{value}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default function SellerDashboardView() {
  const kycStatus = useKycStore((s) => s.kycStatus);
  const kycStatusEnum = (
    kycStatus === null ? null : (kycStatus as KycStatusEnum)
  ) as KycStatusEnum | null;

  const [auctions, setAuctions] = useState<IAuctionDto[]>([]);
  const [auctionsLoading, setAuctionsLoading] = useState(false);
  const [auctionsError, setAuctionsError] = useState<string | null>(null);

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
        const res = await getSellerAuctionsAction();
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

  const stats = useMemo(() => {
    const total = auctions.length;
    const drafts = auctions.filter((a) => a.status === 'DRAFT').length;
    const published = auctions.filter((a) => a.status === 'PUBLISHED').length;
    return { total, drafts, published };
  }, [auctions]);

  const showKycSkeleton = kycStatusEnum === null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold font-serif text-foreground leading-tight">
            Seller Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your auctions and track their status.
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/seller/auction/categories">
              <Layers className="size-4" />
              Categories
            </Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/seller/auction/create">
              <Plus className="size-4" />
              Create Auction
            </Link>
          </Button>
        </div>
      </div>

      {showKycSkeleton ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-white/60 p-6 animate-pulse"
              >
                <div className="h-4 w-28 bg-muted rounded" />
                <div className="mt-4 h-8 w-14 bg-muted rounded" />
                <div className="mt-3 h-3 w-40 bg-muted rounded" />
              </div>
            ))}
          </div>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-2">
                <div className="h-5 w-36 bg-muted rounded animate-pulse" />
                <div className="h-3 w-64 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-7 w-28 bg-muted rounded animate-pulse" />
            </CardHeader>
            <div className="h-px w-full bg-border" />
            <CardContent className="pt-5 space-y-4">
              <div className="rounded-xl border border-dashed border-border bg-background/50 p-4 animate-pulse">
                <div className="h-5 w-56 bg-muted rounded" />
                <div className="mt-3 h-4 w-72 bg-muted rounded" />
              </div>
              <div className="rounded-xl border border-border bg-background/50 animate-pulse">
                <div className="h-44 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : kycStatusEnum !== KycStatusEnum.APPROVED ? (
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-1">
              <CardTitle className="text-lg">Auction Listing</CardTitle>
              <CardDescription>
                Complete seller verification to view and manage auctions.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-muted">
              KYC required
            </Badge>
          </CardHeader>
          <div className="h-px w-full bg-border" />
          <CardContent className="pt-5 space-y-4">
            <div className="rounded-xl border border-border bg-background/50 p-4 text-center">
              <div className="font-semibold text-foreground">
                Your KYC status: {kycStatusEnum ?? '-'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Once approved, your auctions and stats will appear here.
              </div>
              <div className="mt-4">
                <Button asChild className="rounded-xl">
                  <Link href="/seller/kyc">View KYC status</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<Gavel className="size-4" />}
              label="Total auctions"
              value={stats.total}
              description="All auctions created by you."
            />
            <StatCard
              icon={<Clock className="size-4" />}
              label="Drafts"
              value={stats.drafts}
              description="Auctions saved but not published."
            />
            <StatCard
              icon={<CheckCircle2 className="size-4" />}
              label="Published"
              value={stats.published}
              description="Auctions visible to buyers."
            />
          </div>

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-lg">Auction Listing</CardTitle>
                <CardDescription>Your latest auctions.</CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/seller/auction">All auctions</Link>
                </Button>
                <Badge variant="secondary" className="bg-muted">
                  Coming soon
                </Badge>
              </div>
            </CardHeader>
            <div className="h-px w-full bg-border" />
            <CardContent className="pt-5 space-y-4">
              {auctionsLoading ? (
                <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
                  <div className="h-4 w-52 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-56 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </div>
              ) : auctionsError ? (
                <div className="rounded-xl border border-border bg-background/50 p-4 text-center">
                  <div className="font-semibold text-destructive">
                    {auctionsError}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Try refreshing the page.
                  </div>
                </div>
              ) : (
                <SellerAuctionsSimpleTable auctions={auctions} limit={5} />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
