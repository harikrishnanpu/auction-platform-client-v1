'use client';

import { useEffect, useMemo, useState } from 'react';

import { formatCountdown } from '../utils/auction-room.utils';

export function useAuctionRoomCountdown(endAt: unknown): string | null {
  const [now, setNow] = useState(() => Date.now());

  const endMs = useMemo(() => {
    if (!endAt) return null;

    const t =
      endAt instanceof Date
        ? endAt.getTime()
        : new Date(String(endAt)).getTime();
    if (!Number.isFinite(t)) return null;
    return t;
  }, [endAt]);

  useEffect(() => {
    if (endMs == null) return;

    if (endMs - Date.now() <= 0) return;

    const t = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(t);
  }, [endMs]);

  return useMemo(() => {
    if (endMs == null) return null;

    const diff = endMs - now;
    return diff <= 0 ? '0:00' : formatCountdown(diff);
  }, [endMs, now]);
}
