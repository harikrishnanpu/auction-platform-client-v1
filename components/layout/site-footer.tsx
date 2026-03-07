import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-bold text-xl   text-foreground">HammerDown</span>
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
        <p className="text-xs text-muted-foreground">© 2024 HammerDown Inc.</p>
      </div>
    </footer>
  );
}
