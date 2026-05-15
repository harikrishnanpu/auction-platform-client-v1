export type HomeUpdateSlideKind = 'new' | 'feature' | 'offer' | 'plan';

export interface HomeUpdateSlide {
  id: string;
  kind: HomeUpdateSlideKind;
  badge: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

/** Curated highlights shown on the home banner carousel (static copy). */
export const HOME_UPDATE_SLIDES: HomeUpdateSlide[] = [
  {
    id: 'sealed-type',
    kind: 'new',
    badge: 'New',
    title: 'Sealed auctions on select listings',
    description:
      'Bid privately until the window closes — winners revealed when the lot ends.',
    href: '/auctions',
    cta: 'Browse listings',
  },
  {
    id: 'live-rooms',
    kind: 'feature',
    badge: 'Feature',
    title: 'Clearer live auction rooms',
    description:
      'Sharper bid order, calmer reconnects, and steadier streaming when it counts.',
    href: '/auctions',
    cta: 'Join a live lot',
  },
  {
    id: 'seller-offer',
    kind: 'offer',
    badge: 'Offer',
    title: 'Lower fees for new sellers',
    description:
      'Reduced platform fee on your first few sales — start listing with less friction.',
    href: '/seller/auction/create',
    cta: 'Create a listing',
  },
  {
    id: 'pro-plan',
    kind: 'plan',
    badge: 'Plan',
    title: 'Pro membership refreshed',
    description:
      'More active listings, priority placement in browse, and tools tuned for volume.',
    href: '/profile/subscription',
    cta: 'Compare plans',
  },
];
