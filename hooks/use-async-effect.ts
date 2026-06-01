import { useEffect, type DependencyList } from 'react';

/** Runs callback after paint so setState in data-fetch handlers is not synchronous with the effect. */
export function useAsyncEffect(
  effect: () => void | Promise<void> | (() => void),
  deps: DependencyList
) {
  useEffect(() => {
    let active = true;
    let cleanup: void | (() => void);

    void Promise.resolve().then(async () => {
      if (!active) return;
      cleanup = await effect();
    });

    return () => {
      active = false;
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
