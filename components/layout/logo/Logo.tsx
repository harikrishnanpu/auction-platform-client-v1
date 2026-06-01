import Link from 'next/link';
import { APP_BRAND } from '../config/app-nav';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold   transition-transform group-hover:scale-95">
        {APP_BRAND.charAt(0)}
      </div>
      <span className="  text-xl font-bold tracking-tight text-foreground">
        {APP_BRAND}
      </span>
    </Link>
  );
}
