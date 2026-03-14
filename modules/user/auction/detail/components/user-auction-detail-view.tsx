'use client';

import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuctionDetailData } from '../hooks/use-auction-detail-data';
import { useAuctionCountdown } from '../hooks/use-auction-countdown';
import { useBidForm } from '../hooks/use-bid-form';
import { AuctionDetailMedia } from './auction-detail-media';
import { AuctionDetailBidPanel } from './auction-detail-bid-panel';

export interface UserAuctionDetailViewProps {
  auctionId: string;
}

export function UserAuctionDetailView({
  auctionId,
}: UserAuctionDetailViewProps) {
  const { auction, isLoading, isError, error } =
    useAuctionDetailData(auctionId);

  const countdown = useAuctionCountdown(
    auction?.startAt ?? '',
    auction?.endAt ?? '',
    auction?.status ?? ''
  );

  const handlePlaceBid = (amount: number) => {
    console.log('Place bid', amount);
  };

  const { bidAmount, setBidAmount, minBid, step, handleSubmit } = useBidForm({
    auction,
    onSubmit: handlePlaceBid,
  });

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="Loading auction"
      >
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive mb-4">
          {error instanceof Error ? error.message : 'Auction not found'}
        </p>
        <Button variant="outline" asChild>
          <Link href="/auctions">Back to auctions</Link>
        </Button>
      </div>
    );
  }

  const sortedAssets = [...auction.assets].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/auctions" className="gap-2">
            <ArrowLeft size={16} aria-hidden />
            Back to auctions
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AuctionDetailMedia
            title={auction.title}
            sortedAssets={sortedAssets}
          />

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
          <AuctionDetailBidPanel
            title={auction.title}
            category={auction.category}
            condition={auction.condition}
            auctionType={auction.auctionType}
            startPrice={auction.startPrice}
            minIncrement={auction.minIncrement}
            phase={countdown.phase}
            countdownText={countdown.countdownText}
            bidAmount={bidAmount}
            onBidAmountChange={setBidAmount}
            minBid={minBid}
            step={step}
            onBidSubmit={handleSubmit}
            startAt={countdown.startAt}
          />
        </div>
      </div>
    </div>
  );
}
