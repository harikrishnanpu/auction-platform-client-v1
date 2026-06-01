import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, type LucideIcon } from 'lucide-react';

import { appCard } from '@/lib/app-design';
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
    <section className={cn(appCard(), className)}>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
            {Icon ? <Icon className="size-4 text-primary" aria-hidden /> : null}
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {linkHref ? (
          <Link
            href={linkHref}
            className="app-link inline-flex shrink-0 items-center gap-1"
          >
            {linkLabel}
            <ArrowRight className="size-3.5" />
          </Link>
        ) : null}
      </div>

      <div>{children}</div>
    </section>
  );
}
