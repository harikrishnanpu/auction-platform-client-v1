'use client';

import { Bid } from '../types/auction.types';

interface BidGraphProps {
  bids: Bid[];
}

export const BidGraph = ({ bids }: BidGraphProps) => {
  if (!bids.length) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-slate-500">
        No bid activity yet.
      </div>
    );
  }

  const chronological = [...bids].reverse();
  const amounts = chronological.map((b) => b.amount);
  const min = Math.min(...amounts);
  const max = Math.max(...amounts);
  const range = max - min || 1;

  const points = chronological
    .map((bid, index) => {
      const x = (index / Math.max(chronological.length - 1, 1)) * 100;
      const y = 100 - ((bid.amount - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="h-40 w-full">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className="text-blue-500"
        />
      </svg>
    </div>
  );
};
