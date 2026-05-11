import type { IAuctionRoomBid } from '@/types/auctionRoom.types';

export type BidVolumeBucket = {
  key: string;
  label: string;
  count: number;
};

function formatShortTime(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPeakBidFromFeed(feed: IAuctionRoomBid[]): {
  peakAmount: number;
  peakAt: IAuctionRoomBid | null;
} {
  const sorted = [...feed].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  if (!sorted.length) {
    return { peakAmount: 0, peakAt: null };
  }

  const peakAmount = Math.max(...sorted.map((b) => b.amount));
  const lastPeakIdx = sorted.reduce(
    (acc, b, i) => (b.amount === peakAmount ? i : acc),
    -1
  );
  const peakAt = lastPeakIdx >= 0 ? sorted[lastPeakIdx] : null;

  return { peakAmount, peakAt };
}

export function buildBidVolumeBuckets(
  feed: IAuctionRoomBid[],
  bucketCount = 8,
  bucketMinutes = 15
): BidVolumeBucket[] {
  const bucketMs = bucketMinutes * 60 * 1000;
  const end = Date.now();
  const windowMs = bucketCount * bucketMs;
  const start = end - windowMs;

  const buckets: BidVolumeBucket[] = Array.from(
    { length: bucketCount },
    (_, i) => {
      const bStart = start + i * bucketMs;
      return {
        key: `w-${i}`,
        label: formatShortTime(bStart),
        count: 0,
      };
    }
  );

  for (const b of feed) {
    const t = new Date(b.createdAt).getTime();
    if (t < start || t > end) continue;
    const idx = Math.min(bucketCount - 1, Math.floor((t - start) / bucketMs));
    buckets[idx].count += 1;
  }

  return buckets;
}

export function buildEmptyVolumeBuckets(
  bucketCount = 8,
  bucketMinutes = 15
): BidVolumeBucket[] {
  const bucketMs = bucketMinutes * 60 * 1000;
  const end = Date.now();
  const start = end - bucketCount * bucketMs;
  return Array.from({ length: bucketCount }, (_, i) => ({
    key: `e-${i}`,
    label: formatShortTime(start + i * bucketMs),
    count: 0,
  }));
}

export function bidsWithVisibleAmounts(
  feed: IAuctionRoomBid[],
  revealAmounts: boolean
): IAuctionRoomBid[] {
  if (!revealAmounts) return [];
  return feed.filter((b) => typeof b.amount === 'number' && b.amount > 0);
}
