export interface HomeHeroSlide {
  id: string;
  headline: string;
  description: string;
  cta: string;
  href: string;
  gradient: string;
  accent: string;
}

export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    id: 'bid-win-own',
    headline: 'Bid. Win. Own.',
    description:
      'Your next great find is just one bid away. Join live streams and sealed lots across every category.',
    cta: 'Explore Auctions',
    href: '/auctions',
    gradient: 'bg-[var(--surface-hero)]',
    accent: 'bg-primary/15',
  },
  {
    id: 'live-now',
    headline: 'Go Live. Bid Fast.',
    description:
      'Real-time auctions with instant updates. Watch streams, place bids, and win before the hammer falls.',
    cta: 'Watch Live',
    href: '/auctions',
    gradient:
      'bg-linear-to-br from-brand-50 via-sky-50/90 to-white dark:from-brand-950/40 dark:via-slate-900 dark:to-card',
    accent: 'bg-primary/20',
  },
  {
    id: 'sealed',
    headline: 'Sealed. Strategic. Yours.',
    description:
      'Private bids on premium lots. Compete on long auctions and sealed listings closing soon.',
    cta: 'Browse Sealed',
    href: '/auctions',
    gradient:
      'bg-linear-to-br from-sky-50/95 via-brand-50/70 to-white dark:from-sky-950/30 dark:via-brand-950/40 dark:to-card',
    accent: 'bg-primary/12',
  },
  {
    id: 'sell',
    headline: 'Sell Smarter.',
    description:
      'List your items, track payments, and grow your seller dashboard with Hammer Down.',
    cta: 'Seller Hub',
    href: '/seller/dashboard',
    gradient:
      'bg-linear-to-br from-brand-50/80 via-white to-brand-50/40 dark:from-brand-950/50 dark:via-slate-900 dark:to-card',
    accent: 'bg-primary/18',
  },
];

export const HOME_HERO_INTERVAL_MS = 5000;
