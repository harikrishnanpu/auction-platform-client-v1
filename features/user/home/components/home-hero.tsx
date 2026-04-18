import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, User2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getUserAvatarUrl } from '@/utils/auction-utils';

export interface HomeHeroProps {
  name?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  className?: string;
}

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

export function HomeHero({
  name,
  avatarUrl,
  isVerified,
  className,
}: HomeHeroProps) {
  const firstName = resolveDisplayName(name);
  const resolvedAvatar = getUserAvatarUrl(avatarUrl);

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/70 bg-linear-to-br from-blue-500/10 via-background to-purple-500/10 px-4 py-3 sm:px-5 sm:py-4',
        className
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 size-48 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-border/70 bg-muted/50 shadow-sm">
            {resolvedAvatar ? (
              <Image
                src={resolvedAvatar}
                alt={name ?? 'User avatar'}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-foreground/80">
                {initialsOf(name)}
              </div>
            )}
            {isVerified && (
              <span
                aria-label="Verified account"
                className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full border border-background bg-emerald-500 text-white shadow"
              >
                <ShieldCheck className="size-2.5" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              <Sparkles className="size-3" />
              Your dashboard
            </p>
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
              Welcome back,{' '}
              <span className="text-blue-700 dark:text-blue-300">
                {firstName}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" className="h-8 rounded-md">
            <Link href="/auctions">
              Explore
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-8 rounded-md"
          >
            <Link href="/profile">
              <User2 className="size-3.5" />
              Profile
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
