'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  headline: string;
  description: string;
  cta: string;
  href: string;
  gradient: string;
  accent: string;
}

const SLIDES: HeroSlide[] = [
  {
    id: 'bid-win-own',
    headline: 'Bid. Win. Own.',
    description:
      'Your next great find is just one bid away. Join live streams and sealed lots across every category.',
    cta: 'Explore Auctions',
    href: '/auctions',
    gradient:
      'from-brand-50 via-sky-50 to-white dark:from-brand-950/50 dark:via-slate-900 dark:to-card',
    accent: 'bg-brand-400/30',
  },
  {
    id: 'live-now',
    headline: 'Go Live. Bid Fast.',
    description:
      'Real-time auctions with instant updates. Watch streams, place bids, and win before the hammer falls.',
    cta: 'Watch Live',
    href: '/auctions',
    gradient:
      'from-violet-50 via-brand-50 to-white dark:from-violet-950/40 dark:via-brand-950/30 dark:to-card',
    accent: 'bg-violet-400/25',
  },
  {
    id: 'sealed',
    headline: 'Sealed. Strategic. Yours.',
    description:
      'Private bids on premium lots. Compete on long auctions and sealed listings closing soon.',
    cta: 'Browse Sealed',
    href: '/auctions',
    gradient:
      'from-indigo-50 via-slate-50 to-white dark:from-indigo-950/40 dark:via-slate-900 dark:to-card',
    accent: 'bg-indigo-400/25',
  },
  {
    id: 'sell',
    headline: 'Sell Smarter.',
    description:
      'List your items, track payments, and grow your seller dashboard with Hammer Down.',
    cta: 'Seller Hub',
    href: '/seller/dashboard',
    gradient:
      'from-sky-50 via-brand-50/80 to-white dark:from-sky-950/30 dark:via-brand-950/40 dark:to-card',
    accent: 'bg-sky-400/30',
  },
];

const INTERVAL_MS = 5000;

export function HomeHeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = SLIDES.length;

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => {
    goTo(active + 1);
  }, [active, goTo]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(next, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className="relative min-h-[190px] overflow-hidden rounded-xl border border-brand-100 shadow-sm dark:border-brand-900/40 sm:min-h-[210px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured highlights"
    >
      {SLIDES.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 bg-gradient-to-br transition-all duration-700 ease-out',
              slide.gradient,
              isActive
                ? 'z-10 translate-x-0 opacity-100'
                : index < active
                  ? 'z-0 -translate-x-8 opacity-0'
                  : 'z-0 translate-x-8 opacity-0'
            )}
            aria-hidden={!isActive}
          >
            <div
              className={cn(
                'pointer-events-none absolute -right-8 -top-8 size-40 rounded-full blur-3xl',
                slide.accent
              )}
            />
            <div className="relative z-10 flex h-full min-h-[190px] flex-col justify-center p-5 pb-9 sm:min-h-[210px] sm:p-6 sm:pb-10">
              <h2 className="max-w-md text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {slide.headline}
              </h2>
              <p className="mt-1.5 max-w-md text-[13px] text-muted-foreground sm:text-sm">
                {slide.description}
              </p>
              <Link href={slide.href} className="inline-block mt-4 w-fit">
                <Button
                  size="sm"
                  className="rounded-full bg-brand-600 px-5 hover:bg-brand-700 w-full"
                >
                  {slide.cta}
                </Button>
              </Link>
            </div>
          </div>
        );
      })}

      <div
        className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Carousel slides"
      >
        {SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            onClick={() => goTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 ease-out',
              index === active
                ? 'w-6 bg-brand-600 dark:bg-brand-500'
                : 'w-2 bg-brand-600/30 hover:bg-brand-600/50 dark:bg-brand-400/35 dark:hover:bg-brand-400/55'
            )}
            aria-label={slide.headline}
            aria-selected={index === active}
          />
        ))}
      </div>
    </section>
  );
}
