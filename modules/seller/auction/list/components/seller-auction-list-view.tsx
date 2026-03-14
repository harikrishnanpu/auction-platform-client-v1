'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gavel, Loader2, Pencil, Eye } from 'lucide-react';
import { getSellerAuctionsAction } from '@/actions/auction/auction.actions';
import { SellerAuctionListItem } from '@/types/auction.type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuctionStatusBadge } from '@/components/auction/auction-status-badge';
import { AuctionTypeBadge } from '@/components/auction/auction-type-badge';
import { getAuctionImageUrl } from '@/lib/auction-utils';

export function SellerAuctionListView() {
  const [auctions, setAuctions] = useState<SellerAuctionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getSellerAuctionsAction().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) setAuctions(res.data.auctions);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">
            My Auctions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage your listings, edit drafts, and publish when ready.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/seller/auction/create">
            <Gavel size={16} className="mr-2" />
            Create Auction
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden rounded-2xl">
        <CardHeader className="border-b bg-muted/50 py-5">
          <CardTitle className="text-lg font-serif">All Listings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : auctions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <p className="mb-4">No auctions yet.</p>
              <Button asChild>
                <Link href="/seller/auction/create">
                  Create your first auction
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {auctions.map((auction) => (
                <div
                  key={auction.id}
                  className="p-5 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="h-16 w-16 bg-muted rounded-xl shrink-0 overflow-hidden relative">
                    <img
                      src={getAuctionImageUrl(auction.primaryImageKey)}
                      alt={auction.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-foreground truncate">
                        {auction.title}
                      </h4>
                      <AuctionStatusBadge status={auction.status} />
                      <AuctionTypeBadge auctionType={auction.auctionType} />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {auction.category} • ₹{' '}
                      {auction.startPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(auction.startAt).toLocaleDateString()} –{' '}
                      {new Date(auction.endAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/seller/auction/${auction.id}`} title="View">
                        <Eye size={16} className="mr-1" />
                        View
                      </Link>
                    </Button>
                    {auction.status === 'DRAFT' && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/seller/auction/${auction.id}/edit`}
                          title="Edit"
                        >
                          <Pencil size={16} className="mr-1" />
                          Edit
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
