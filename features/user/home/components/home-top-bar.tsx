import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getUserAvatarUrl } from '@/utils/auction-utils';

import { HomeStats } from './home-stats';
import type { IUserHomeStats } from '../types/home.types';

function resolveDisplayName(name?: string): string {
  const trimmed = name?.trim();
  if (!trimmed) return 'there';
  const [first] = trimmed.split(/\s+/);
  return first ?? trimmed;
}

function initialsOf(name?: string): string {
  const trimmed = name?.trim();
  if (!trimmed) return 'U';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '');
  return letters.join('') || 'U';
}

export interface HomeTopBarProps {
  name?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  planSummary?: string;
  stats: IUserHomeStats;
  className?: string;
}

export function HomeTopBar({
  name,
  avatarUrl,
  isVerified,
  planSummary,
  stats,
  className,
}: HomeTopBarProps) {
  const firstName = resolveDisplayName(name);
  const resolvedAvatar = getUserAvatarUrl(avatarUrl);

  return (
    <section
      className={cn(
        'rounded-[12px] border border-border/80 bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:p-5',
        className
      )}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-border/80 bg-[#f5f5f5] dark:bg-muted">
              {resolvedAvatar ? (
                <Image
                  src={resolvedAvatar}
                  alt={name ?? 'User avatar'}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-semibold tracking-tight text-foreground/80">
                  {initialsOf(name)}
                </div>
              )}
              {isVerified ? (
                <span
                  aria-label="Verified account"
                  className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border border-background bg-emerald-600 text-white shadow-sm"
                >
                  <ShieldCheck className="size-2.5" />
                </span>
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                Hi, {firstName}
              </h1>
              {planSummary ? (
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {planSummary}
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted-foreground">
                  Here’s what’s happening across the marketplace.
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            {/* <Button
              asChild
              size="sm"
className="h-9 rounded-[8px] text-black hover:bg-gray-200 dark:bg-primary dark:text-white dark:hover:bg-primary/90"            >
              <Link href="/auctions">
                Browse auctions
                <ArrowRight className="size-3.5" />
              </Link>
            </Button> */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 rounded-[8px]"
            >
              <Link href="/profile">Profile</Link>
            </Button>
          </div>
        </div>

        <HomeStats stats={stats} variant="dashboard" />
      </div>
    </section>
  );
}
