'use client';

import { useCallback, useEffect, useState } from 'react';

export function useBidCooldown() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (endsAt == null) return;

    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemainingSeconds(left);
      if (left === 0) {
        setEndsAt(null);
      }
    };

    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [endsAt]);

  const start = useCallback((seconds: number) => {
    setEndsAt(Date.now() + Math.max(0, seconds) * 1000);
  }, []);

  return { remainingSeconds, start };
}
