'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layers, Plus } from 'lucide-react';

import { getSellerAuctionsAction } from '@/actions/auction/auction.actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SellerAuctionsCards } from '@/modules/seller/auction/components/seller-auctions-cards';
import {
  SellerAuctionListSkeleton,
  SellerListingSectionSkeleton,
} from '@/modules/seller/components/seller-shell-skeleton';
import useKycStore from '@/store/kyc.store';
import { KycStatusEnum } from '@/types/kyc.type';
import type {
  IAuctionDto,
  IGetAllSellerAuctionsFilter,
} from '@/types/auction.type';

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

  const showKycSkeleton = kycStatusEnum === null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="mx-auto max-w-5xl space-y-4 px-3 py-4 sm:px-4">
        <header className="flex flex-col gap-3 border-b border-border/60 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Seller
            </h1>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Auctions and listings
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button asChild variant="ghost" size="sm" className="h-8 text-xs">
              <Link href="/seller/auction/categories">
                <Layers className="size-3.5" />
                Categories
              </Link>
            </Button>
            <Button asChild size="sm" className="h-8 text-xs">
              <Link href="/seller/auction/create">
                <Plus className="size-3.5" />
                New auction
              </Link>
            </Button>
          </div>
        </header>

        {showKycSkeleton ? (
          <SellerListingSectionSkeleton />
        ) : kycStatusEnum !== KycStatusEnum.APPROVED ? (
          <div className="rounded-lg border border-border/70 bg-muted/10 px-3 py-6 text-center">
            <p className="text-xs text-muted-foreground">
              Verify your seller account to manage auctions.
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-[10px]">
                {kycStatusEnum ?? '—'}
              </Badge>
            </div>
            <Button asChild className="mt-4 h-8 text-xs" size="sm">
              <Link href="/seller/kyc">Seller KYC</Link>
            </Button>
          </div>
        ) : (
          <section className="rounded-lg border border-border/70 bg-card/20">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5">
              <div>
                <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                  Latest auctions
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Showing 5 newest auctions by start time.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 text-xs"
              >
                <Link href="/seller/auctions">View all auctions</Link>
              </Button>
            </div>

            <div className="p-3">
              {auctionsLoading ? (
                <SellerAuctionListSkeleton count={5} />
              ) : auctionsError ? (
                <div className="rounded-md border border-destructive/25 bg-destructive/5 px-3 py-6 text-center">
                  <p className="text-xs font-medium text-destructive">
                    {auctionsError}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Refresh and try again.
                  </p>
                </div>
              ) : (
                <SellerAuctionsCards
                  auctions={auctions}
                  limit={5}
                  className="mx-auto max-w-3xl"
                  sortMode="none"
                  emptyAction={
                    <Button asChild className="h-8 text-xs" size="sm">
                      <Link href="/seller/auction/create">Create auction</Link>
                    </Button>
                  }
                />
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
