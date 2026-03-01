import { Logo } from '@/components/ui/logo/Logo';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function AuthNavbar() {
  return (
    <nav className="absolute top-0 w-full px-6 py-6 flex justify-between items-center z-50">
      <Logo />
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition hidden sm:inline-flex items-center gap-1 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}

export default AuthNavbar;
