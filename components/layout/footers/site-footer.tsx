import Link from 'next/link';
import { APP_BRAND } from '../config/app-nav';

export function SiteFooter({
  year = String(new Date().getFullYear()),
  appVersion = '1.0.0',
}: {
  year?: string;
  appVersion?: string;
}) {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-bold text-xl   text-foreground">{APP_BRAND}</span>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <Link className="hover:text-foreground transition" href="#">
            Privacy Policy
          </Link>
          <Link className="hover:text-foreground transition" href="#">
            Terms of Service
          </Link>
          <Link className="hover:text-foreground transition" href="#">
            Support
          </Link>
        </div>
        <p data-testid="copyright" className="text-xs text-muted-foreground">
          © {year} {APP_BRAND} Inc.
        </p>
        <p data-testid="app-version" className="text-xs text-muted-foreground">
          v{appVersion}
        </p>
      </div>
    </footer>
  );
}
