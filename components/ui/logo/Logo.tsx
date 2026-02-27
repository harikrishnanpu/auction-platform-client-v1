import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold   transition-transform group-hover:scale-95">
        H
      </div>
      <span className="  text-xl font-bold tracking-tight text-foreground">
        Hammr.Down
      </span>
    </Link>
  );
}
