import { cn } from '@/lib/utils';

/**
 * Auction room surfaces aligned with the user home page:
 * HomeTopBar / HomeLeftRail / HomeParticipatedRail use the same card chrome.
 */

/** Same as home rail cards: rounded-[12px] border border-border/80 bg-card + soft shadow */
export function arCardCanvas(className?: string) {
  return cn(
    'rounded-[12px] border border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
    className
  );
}

/** Page root: inherit main layout gradient — no flat gray overlay */
export function arPage(className?: string) {
  return cn('relative w-full', className);
}

/** Matches `home/page.tsx` outer wrapper */
export function arContainer(className?: string) {
  return cn('mx-auto max-w-[1200px] px-3 py-3 sm:px-4 sm:py-5', className);
}

/** Inset blocks (timers, forms) — like home empty-state panels */
export function arInset(className?: string) {
  return cn(
    'rounded-[8px] border border-border/80 bg-muted/30 dark:bg-muted/20',
    className
  );
}

/** Meta / category pill strip — soft muted tray */
export function arPillGroup(className?: string) {
  return cn(
    'inline-flex flex-wrap items-center gap-1 rounded-full bg-muted/50 p-1.5',
    className
  );
}

export const arType = {
  displayRoomTitle:
    'text-balance text-sm font-semibold tracking-tight text-foreground sm:text-base',
  /** Left rail listing card — room for long titles in a narrow column */
  listingTitle:
    'text-pretty wrap-break-word text-[15px] font-semibold leading-snug tracking-tight text-foreground sm:text-base',
  listingMetaLabel:
    'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground',
  sectionLabel:
    'text-[10px] font-semibold uppercase tracking-wide text-muted-foreground',
  cardTitle: 'text-xs font-semibold tracking-tight text-foreground',
  cardDesc: 'text-[11px] leading-snug text-muted-foreground',
  body: 'text-xs leading-relaxed text-foreground',
  bodySm: 'text-[11px] text-muted-foreground',
  monoStat: 'font-mono text-[11px] tabular-nums text-foreground',
} as const;

/** Primary CTA — compact height to match home actions */
export function arBtnPrimary(className?: string) {
  return cn(
    'h-9 rounded-[8px] bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90',
    'disabled:pointer-events-none disabled:opacity-50',
    className
  );
}

/** Secondary — outline style like HomeTopBar profile button */
export function arBtnSecondary(className?: string) {
  return cn(
    'h-9 rounded-[8px] border border-border/80 bg-background font-semibold text-foreground',
    'hover:bg-muted/80',
    className
  );
}
