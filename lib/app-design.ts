import { cn } from '@/lib/utils';

/** Elevated panel — soft shadow, minimal ring (reference-style cards). */
export function appCard(className?: string) {
  return cn(
    'rounded-3xl bg-card p-5 sm:p-6',
    'shadow-[var(--surface-shadow)] ring-1 ring-[var(--surface-ring)]',
    className
  );
}

/** Clickable / link card with hover lift. */
export function appCardInteractive(className?: string) {
  return cn(
    appCard(),
    'transition-[box-shadow,transform,background-color] duration-200',
    'hover:shadow-[var(--surface-shadow-hover)] hover:-translate-y-0.5 hover:bg-[var(--surface-hover)]',
    className
  );
}

/** Nested stat / info block inside a card. */
export function appInset(className?: string) {
  return cn(
    'rounded-2xl border border-border/50 bg-[var(--surface-inset)] p-4',
    'shadow-[var(--surface-shadow-sm)]',
    className
  );
}

/** Stat tile — bordered inner box like reference dashboard stats. */
export function appStatTile(className?: string) {
  return cn(appInset(), className);
}

/** Primary CTA / promo block. */
export function appCardPromo(className?: string) {
  return cn(
    'relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground sm:p-7',
    'shadow-[var(--surface-shadow-promo)]',
    className
  );
}

/** Hero carousel / banner shell. */
export function appHero(className?: string) {
  return cn(
    'relative overflow-hidden rounded-3xl',
    'bg-[var(--surface-hero)]',
    'shadow-[var(--surface-shadow)] ring-1 ring-[var(--surface-ring)]',
    className
  );
}

/** Dashed empty / placeholder state. */
export function appEmptyState(className?: string) {
  return cn(
    'rounded-2xl border border-dashed border-[var(--surface-empty-border)]',
    'bg-[var(--surface-inset)] text-center',
    className
  );
}

/** Sidebar / quick-nav rail. */
export function appNavRail(className?: string) {
  return cn(appCard('p-3'), className);
}

/** Active item inside nav rails. */
export function appNavItemActive(className?: string) {
  return cn(
    'rounded-xl bg-[var(--surface-nav-active)] font-semibold text-primary',
    className
  );
}

/** List row hover inside cards. */
export function appListRow(className?: string) {
  return cn(
    'rounded-2xl transition-colors duration-150',
    'hover:bg-[var(--surface-inset)]',
    className
  );
}

/** Auction listing card shell. */
export function appAuctionCard(className?: string) {
  return cn(
    'group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card',
    'shadow-[var(--surface-shadow)] ring-1 ring-[var(--surface-ring)]',
    'transition-[box-shadow,transform] duration-200',
    'hover:shadow-[var(--surface-shadow-hover)] hover:-translate-y-0.5',
    'hover:ring-[var(--surface-ring-hover)]',
    className
  );
}

/** Circular category / icon badge (white disc + soft shadow). */
export function appIconBadge(className?: string) {
  return cn(
    'flex items-center justify-center rounded-full bg-[var(--surface-icon)] text-primary',
    'shadow-[var(--surface-shadow-sm)] ring-1 ring-[var(--surface-ring)]',
    className
  );
}

/** Pill primary button styling helper. */
export function appBtnPill(className?: string) {
  return cn(
    'rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-sm',
    'hover:bg-primary/90',
    className
  );
}

export const appStack = 'space-y-6';
export const appGridGap = 'gap-6';
