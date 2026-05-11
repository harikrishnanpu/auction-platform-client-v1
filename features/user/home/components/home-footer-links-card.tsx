import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const PLATFORM_LINKS = [
  { label: 'Features', href: '#' },
  { label: 'Integrations', href: '#' },
  { label: 'Pricing', href: '/profile/subscription' },
  { label: 'API Docs', href: '#' },
] as const;

const COMPANY_LINKS = [
  { label: 'About Us', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Contact', href: '#' },
] as const;

export function HomeFooterLinksCard({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        'rounded-[12px] border-border/80 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        className
      )}
    >
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Hammr.Down
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-3 pt-0">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Platform
            </p>
            <ul className="space-y-1.5">
              {PLATFORM_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[11px] text-foreground/90 transition-colors hover:text-primary hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Company
            </p>
            <ul className="space-y-1.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[11px] text-foreground/90 transition-colors hover:text-primary hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border/70 pt-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Contact
          </p>
          <ul className="space-y-1 text-[10px] text-muted-foreground">
            <li>hello@hammr.down</li>
            <li>+1 (555) 123-4567</li>
            <li>San Francisco, CA</li>
          </ul>
          <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
            The premium SaaS solution for modern auctioneers. Secure, fast, and
            scalable.
          </p>
          <p className="mt-2 text-[10px] text-muted-foreground">
            © {new Date().getFullYear()} Hammr.Down Inc. All rights reserved.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
