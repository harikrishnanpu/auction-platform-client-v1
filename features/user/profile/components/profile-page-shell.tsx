import type { LucideIcon } from 'lucide-react';

import { appCard } from '@/lib/app-design';
import { cn } from '@/lib/utils';

export function ProfilePageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-3xl space-y-5 pb-12 pt-2 lg:max-w-4xl',
        className
      )}
    >
      {children}
    </div>
  );
}

export function ProfilePageCard({
  children,
  className,
  title,
  icon: Icon,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className={appCard(className)}>
      {title ? (
        <h2 className="app-section-title mb-4 flex items-center gap-2">
          {Icon ? <Icon className="size-4 text-brand-600" /> : null}
          {title}
        </h2>
      ) : null}
      {children}
    </div>
  );
}
