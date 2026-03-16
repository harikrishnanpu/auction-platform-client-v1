'use client';

import Link from 'next/link';
import {
  Loader2,
  Pencil,
  ArrowLeft,
  Calendar,
  Tag,
  IndianRupee,
} from 'lucide-react';
import { AuctionDetail } from '@/types/auction.type';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuctionStatusBadge } from '@/components/auction/auction-status-badge';
import { AuctionTypeBadge } from '@/components/auction/auction-type-badge';
import { getAuctionImageUrl } from '@/lib/auction-utils';

function getDummyAuction(auctionId: string): AuctionDetail {
  const now = new Date();
  const startAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const endAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return {
    id: auctionId,
    sellerId: 'dummy-seller-id',
    auctionType: 'LONG',
    title: 'Dummy Auction Detail',
    description: 'Sample description for this auction.',
    category: 'Watches',
    condition: 'Used - Good',
    startPrice: 5000,
    minIncrement: 100,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    status: 'DRAFT',
    assets: [
      {
        id: 'asset-1',
        auctionId,
        fileKey: 'dummy/key.jpg',
        position: 0,
        assetType: 'IMAGE',
      },
    ],
    antiSnipSeconds: 60,
    extensionCount: 0,
    maxExtensionCount: 3,
    bidCooldownSeconds: 10,
    winnerId: null,
  };
}

export interface SellerAuctionDetailViewProps {
  auctionId: string;
}

export function SellerAuctionDetailView({
  auctionId,
}: SellerAuctionDetailViewProps) {
  const auction = getDummyAuction(auctionId);
  const loading = false;
  const error: string | null = null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive mb-4">{error ?? 'Auction not found'}</p>
        <Button variant="outline" asChild>
          <Link href="/seller/auction">Back to list</Link>
        </Button>
      </div>
    );
  }

  const sortedAssets = [...auction.assets].sort(
    (a, b) => a.position - b.position
  );
  const primaryAsset = sortedAssets[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/seller/auction" className="gap-2">
            <ArrowLeft size={16} />
            Back to auctions
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">
              {auction.title}
            </h1>
            <AuctionStatusBadge status={auction.status} />
            <AuctionTypeBadge auctionType={auction.auctionType} />
          </div>
          <p className="text-muted-foreground text-sm">
            {auction.category} • {auction.condition}
          </p>
        </div>
        {auction.status === 'DRAFT' && (
          <Button asChild size="sm">
            <Link href={`/seller/auction/${auctionId}/edit`} className="gap-2">
              <Pencil size={16} />
              Edit draft
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden rounded-2xl">
            <div className="aspect-video bg-muted relative">
              {primaryAsset ? (
                primaryAsset.assetType === 'VIDEO' ? (
                  <video
                    src={getAuctionImageUrl(primaryAsset.fileKey)}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={getAuctionImageUrl(primaryAsset.fileKey)}
                    alt={auction.title}
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  No media
                </div>
              )}
            </div>
            {sortedAssets.length > 1 && (
              <div className="p-3 flex gap-2 overflow-x-auto border-t">
                {sortedAssets.slice(1, 5).map((asset) => (
                  <div
                    key={asset.id}
                    className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border bg-muted"
                  >
                    {asset.assetType === 'VIDEO' ? (
                      <video
                        src={getAuctionImageUrl(asset.fileKey)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={getAuctionImageUrl(asset.fileKey)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {auction.description || 'No description.'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <IndianRupee className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start price</p>
                  <p className="font-semibold">
                    ₹ {auction.startPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Min increment</p>
                  <p className="font-semibold">
                    ₹ {auction.minIncrement.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start</p>
                  <p className="font-medium text-sm">
                    {new Date(auction.startAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">End</p>
                  <p className="font-medium text-sm">
                    {new Date(auction.endAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
