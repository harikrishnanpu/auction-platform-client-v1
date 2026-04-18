import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface HomeSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
  children: ReactNode;
}

export function HomeSection({
  title,
  description,
  icon: Icon,
  linkHref,
  linkLabel = 'View all',
  className,
  children,
}: HomeSectionProps) {
  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-1.5 text-base font-semibold tracking-tight text-foreground">
            {Icon ? (
              <Icon className="size-4 text-blue-600 dark:text-blue-400" />
            ) : null}
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        {linkHref ? (
          <Link
            href={linkHref}
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1',
              'text-[11px] font-semibold text-blue-600 transition-colors',
              'hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/50'
            )}
          >
            {linkLabel}
            <ArrowRight className="size-3" />
          </Link>
        ) : null}
      </div>

      <div>{children}</div>
    </section>
  );
}
