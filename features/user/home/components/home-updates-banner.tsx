'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  HOME_UPDATE_SLIDES,
  type HomeUpdateSlideKind,
} from '../config/home-update-slides';

const AUTO_MS = 7000;

const BADGE_CLASS: Record<
  HomeUpdateSlideKind,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className?: string;
  }
> = {
  new: { variant: 'destructive', className: 'uppercase tracking-wide' },
  feature: { variant: 'secondary', className: 'uppercase tracking-wide' },
  offer: {
    variant: 'outline',
    className:
      'border-amber-500/45 bg-amber-500/10 text-amber-950 uppercase tracking-wide dark:border-amber-500/35 dark:bg-amber-500/10 dark:text-amber-100',
  },
  plan: { variant: 'default', className: 'uppercase tracking-wide' },
};

function wrap(i: number, len: number) {
  return ((i % len) + len) % len;
}

export function HomeUpdatesBanner({ className }: { className?: string }) {
  const slides = HOME_UPDATE_SLIDES;
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pauseRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => wrap(i + dir, n));
    },
    [n]
  );

  useEffect(() => {
    if (reducedMotion || n <= 1) return;
    const id = window.setInterval(() => {
      if (!pauseRef.current) setIndex((i) => wrap(i + 1, n));
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion, n]);

  const fadeClass = reducedMotion
    ? ''
    : 'transition-opacity duration-300 ease-out';

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Platform updates"
      className={cn('min-w-0', className)}
      onPointerEnter={() => {
        pauseRef.current = true;
      }}
      onPointerLeave={() => {
        pauseRef.current = false;
      }}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-border/60 shadow-sm',
          'bg-linear-to-br from-primary/6 via-card to-muted/30',
          'dark:from-primary/10 dark:via-card dark:to-muted/20'
        )}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-12 size-48 rounded-full bg-muted-foreground/5 blur-2xl"
          aria-hidden
        />

        {/* Side gutters for arrows so the slide tile is never covered; dots stay in the tile column. */}
        <div className="flex min-h-[168px] items-stretch sm:min-h-[152px]">
          <div
            className={cn(
              'hidden shrink-0 sm:items-center sm:justify-center sm:pl-2',
              n > 1 && 'sm:flex sm:w-11'
            )}
          >
            {n > 1 ? (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Previous update"
                className="size-8 rounded-full border border-border/80 bg-background/95 shadow-md backdrop-blur-sm"
                onClick={() => go(-1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
            ) : null}
          </div>

          <div className="relative min-h-0 min-w-0 flex-1 px-4 pb-10 pt-5 sm:px-5 sm:pb-9 sm:pt-6">
            {slides.map((slide, slideIndex) => {
              const badge = BADGE_CLASS[slide.kind];
              const active = slideIndex === index;
              return (
                <article
                  key={slide.id}
                  aria-hidden={!active}
                  inert={!active}
                  className={cn(
                    'flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6',
                    fadeClass,
                    active
                      ? 'relative z-10 opacity-100'
                      : 'pointer-events-none absolute inset-0 z-0 box-border opacity-0',
                    !active && 'px-4 pb-10 pt-5 sm:px-5 sm:pb-9 sm:pt-6'
                  )}
                  id={`home-update-slide-${slide.id}`}
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <Badge
                      variant={badge.variant}
                      className={cn(
                        'text-[10px] font-semibold',
                        badge.className
                      )}
                    >
                      {slide.badge}
                    </Badge>
                    <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {slide.title}
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                      {slide.description}
                    </p>
                  </div>
                  <div className="shrink-0 sm:pb-0.5">
                    <Button
                      size="sm"
                      className="h-9 rounded-lg px-4 text-xs font-semibold shadow-sm"
                    >
                      <Link href={slide.href}>{slide.cta}</Link>
                    </Button>
                  </div>
                </article>
              );
            })}

            {n > 1 ? (
              <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5 sm:bottom-3.5">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Show update ${i + 1} of ${n}`}
                    aria-current={i === index ? 'true' : undefined}
                    className={cn(
                      'h-1.5 rounded-full transition-[width,background-color] duration-300',
                      i === index
                        ? 'w-6 bg-primary'
                        : 'w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/55'
                    )}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div
            className={cn(
              'hidden shrink-0 sm:items-center sm:justify-center sm:pr-2',
              n > 1 && 'sm:flex sm:w-11'
            )}
          >
            {n > 1 ? (
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Next update"
                className="size-8 rounded-full border border-border/80 bg-background/95 shadow-md backdrop-blur-sm"
                onClick={() => go(1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {n}: {slides[index]?.title}
      </p>
    </section>
  );
}
