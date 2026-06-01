'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { appBtnPill, appHero } from '@/lib/app-design';
import { cn } from '@/lib/utils';

import {
  HOME_HERO_INTERVAL_MS,
  HOME_HERO_SLIDES,
} from '../config/home-hero-slides';

export function HomeHeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = HOME_HERO_SLIDES.length;

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
    const id = window.setInterval(next, HOME_HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, next]);

  return (
    <section
      className={cn(appHero(), 'min-h-[220px] sm:min-h-[240px]')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured highlights"
    >
      {HOME_HERO_SLIDES.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-all duration-700 ease-out',
              slide.gradient,
              isActive
                ? 'z-10 translate-x-0 opacity-100'
                : index < active
                  ? 'z-0 -translate-x-6 opacity-0'
                  : 'z-0 translate-x-6 opacity-0'
            )}
            aria-hidden={!isActive}
          >
            <div
              className={cn(
                'pointer-events-none absolute -right-10 -top-10 size-48 rounded-full blur-3xl',
                slide.accent
              )}
            />
            <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-center px-6 pb-11 pt-6 sm:min-h-[240px] sm:px-8 sm:pb-12">
              <h2 className="max-w-md text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
                {slide.headline}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {slide.description}
              </p>
              <Link href={slide.href} className="mt-5 inline-block w-fit">
                <Button size="sm" className={appBtnPill('h-9 px-6')}>
                  {slide.cta}
                </Button>
              </Link>
            </div>
          </div>
        );
      })}

      <div
        className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Carousel slides"
      >
        {HOME_HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            onClick={() => goTo(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300 ease-out',
              index === active
                ? 'w-7 bg-primary'
                : 'w-2 bg-primary/25 hover:bg-primary/40'
            )}
            aria-label={slide.headline}
            aria-selected={index === active}
          />
        ))}
      </div>
    </section>
  );
}
