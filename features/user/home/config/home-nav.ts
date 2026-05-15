import {
  Crown,
  Gavel,
  Handshake,
  Home,
  LayoutGrid,
  UserRound,
} from 'lucide-react';

export const HOME_NAV_LINKS = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/auctions', label: 'Browse', icon: LayoutGrid },
  { href: '/profile/my-auctions', label: 'My auctions', icon: Handshake },
  { href: '/profile', label: 'Profile', icon: UserRound },
  { href: '/profile/subscription', label: 'Plans', icon: Crown },
  { href: '/seller/landing', label: 'Sell', icon: Gavel },
] as const;

export function homeNavLinkActive(pathname: string, href: string): boolean {
  if (href === '/home') return pathname === '/home';
  if (href === '/profile/my-auctions') {
    return (
      pathname === '/profile/my-auctions' ||
      pathname.startsWith('/profile/my-auctions/')
    );
  }
  if (href === '/profile/subscription') {
    return (
      pathname === '/profile/subscription' ||
      pathname.startsWith('/profile/subscription/')
    );
  }
  if (href === '/profile') {
    if (pathname === '/profile') return true;
    if (!pathname.startsWith('/profile/')) return false;
    if (pathname.startsWith('/profile/my-auctions')) return false;
    if (pathname.startsWith('/profile/subscription')) return false;
    return true;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
