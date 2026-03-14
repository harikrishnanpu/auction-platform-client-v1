'use client';

import { useState, useEffect, useMemo } from 'react';

export type AuctionCountdownPhase = 'upcoming' | 'live' | 'ended';

export interface AuctionCountdownState {
  now: Date;
  phase: AuctionCountdownPhase;
  countdownText: string;
  startAt: Date;
  endAt: Date;
}

export function useAuctionCountdown(
  startAt: string,
  endAt: string,
  status: string
): AuctionCountdownState {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const start = useMemo(() => new Date(startAt), [startAt]);
  const end = useMemo(() => new Date(endAt), [endAt]);

  const phase: AuctionCountdownPhase = useMemo(() => {
    if (status === 'ENDED' || status === 'SOLD' || now >= end) return 'ended';
    if (now < start) return 'upcoming';
    return 'live';
  }, [status, now, start, end]);

  const countdownText = useMemo(() => {
    if (phase === 'upcoming') {
      const d = start.getTime() - now.getTime();
      const h = Math.floor(d / 3600000);
      const m = Math.floor((d % 3600000) / 60000);
      const s = Math.floor((d % 60000) / 1000);
      return `Starts in ${h}h ${m}m ${s}s`;
    }
    if (phase === 'ended') return 'Auction ended';
    const d = end.getTime() - now.getTime();
    const h = Math.floor(d / 3600000);
    const m = Math.floor((d % 3600000) / 60000);
    const s = Math.floor((d % 60000) / 1000);
    return `Ends in ${h}h ${m}m ${s}s`;
  }, [phase, now, start, end]);

  return { now, phase, countdownText, startAt: start, endAt: end };
}
