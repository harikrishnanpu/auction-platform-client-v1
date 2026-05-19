import {
  BarChart3,
  Bell,
  CreditCard,
  Gavel,
  Handshake,
  HelpCircle,
  Home,
  LayoutGrid,
  Mail,
  MonitorPlay,
  Plus,
  Settings,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface AppNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface UserRoomNavItem extends AppNavItem {
  id: string;
}

export interface SellerRoomNavItem extends AppNavItem {
  id: string;
}

export function isSellerAuctionRoomPath(pathname: string): boolean {
  return /^\/seller\/auctions\/[^/]+$/.test(pathname);
}

export function isUserAuctionRoomPath(pathname: string): boolean {
  return /^\/auction\/[^/]+$/.test(pathname);
}

export function isAnyAuctionRoomPath(pathname: string): boolean {
  return isSellerAuctionRoomPath(pathname) || isUserAuctionRoomPath(pathname);
}

export function getAuctionRoomHeaderMeta(pathname: string): {
  title: string;
  subtitle: string;
} | null {
  if (isSellerAuctionRoomPath(pathname)) {
    return {
      title: 'Auction Room',
      subtitle: 'Host, monitor bids, and manage this auction.',
    };
  }
  if (isUserAuctionRoomPath(pathname)) {
    return {
      title: 'Auction Room',
      subtitle: 'Place bids, follow the action, and chat with participants.',
    };
  }
  return null;
}

export const APP_BRAND = 'Hammer Down';

/** User / home sidebar — wallet, payments, auctions (no seller tools). */
export const USER_NAV: AppNavItem[] = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/auctions', label: 'All Auctions', icon: LayoutGrid },
  { href: '/profile/my-auctions', label: 'My Auctions', icon: Handshake },
  { href: '/profile/wallet', label: 'Wallet', icon: Wallet },
  { href: '/profile/payments', label: 'Payments', icon: CreditCard },
  { href: '/profile/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Profile', icon: UserRound },
];

export const USER_QUICK_ACTIONS: AppNavItem[] = [
  { href: '/profile/subscription', label: 'Plans & Refer', icon: Sparkles },
];

export const USER_ROOM_NAV: UserRoomNavItem[] = [
  {
    id: 'all-auctions',
    href: '/auctions',
    label: 'All Auctions',
    icon: LayoutGrid,
  },
  { id: 'home', href: '/home', label: 'Home', icon: Home },
  {
    id: 'my-auctions',
    href: '/profile/my-auctions',
    label: 'My Auctions',
    icon: Handshake,
  },
  { id: 'auction-room', href: '#', label: 'Auction Room', icon: MonitorPlay },
  { id: 'bids', href: '/profile/my-auctions', label: 'Bids', icon: TrendingUp },
  {
    id: 'payments',
    href: '/profile/payments',
    label: 'Payments',
    icon: CreditCard,
  },
  {
    id: 'notifications',
    href: '/profile/notifications',
    label: 'Notifications',
    icon: Bell,
  },
  { id: 'profile', href: '/profile', label: 'Profile', icon: UserRound },
  { id: 'settings', href: '/profile', label: 'Settings', icon: Settings },
];

export const USER_ROOM_QUICK_ACTIONS: AppNavItem[] = [
  { href: '/auctions', label: 'Browse Categories', icon: LayoutGrid },
  { href: '/profile', label: 'Help Center', icon: HelpCircle },
  { href: '/profile', label: 'Contact Us', icon: Mail },
];

/** Seller area sidebar (dashboard, auctions, payments, etc.). */
export const SELLER_NAV: AppNavItem[] = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: Store },
  { href: '/seller/auctions', label: 'Auctions', icon: Gavel },
  { href: '/seller/auction/create', label: 'Create Auction', icon: Plus },
  { href: '/seller/auction/categories', label: 'Categories', icon: Tag },
  { href: '/seller/payments', label: 'Payments', icon: CreditCard },
];

export const SELLER_QUICK_ACTIONS: AppNavItem[] = [
  { href: '/seller/auction/create', label: 'Create Auction', icon: Plus },
  { href: '/seller/auctions', label: 'Manage Auctions', icon: Gavel },
];

export const SELLER_ROOM_NAV: SellerRoomNavItem[] = [
  {
    id: 'dashboard',
    href: '/seller/dashboard',
    label: 'Dashboard',
    icon: Store,
  },
  { id: 'auctions', href: '/seller/auctions', label: 'Auctions', icon: Gavel },
  { id: 'auction-room', href: '#', label: 'Auction Room', icon: MonitorPlay },
  {
    id: 'payments',
    href: '/seller/payments',
    label: 'Payments',
    icon: CreditCard,
  },
  {
    id: 'analytics',
    href: '/seller/dashboard',
    label: 'Analytics',
    icon: BarChart3,
  },
  { id: 'settings', href: '/profile', label: 'Settings', icon: Settings },
];

export const SELLER_ROOM_QUICK_ACTIONS: AppNavItem[] = [
  { href: '/seller/auction/create', label: 'Create Auction', icon: Plus },
  { href: '/seller/auctions', label: 'Manage Auctions', icon: Gavel },
];

export const SUPPORT_NAV: AppNavItem[] = [
  { href: '/profile', label: 'Help Center', icon: HelpCircle },
  { href: '/profile', label: 'Contact Us', icon: Mail },
];

/** @deprecated Use USER_NAV */
export const MAIN_NAV = USER_NAV;

/** @deprecated Use USER_QUICK_ACTIONS */
export const QUICK_ACTIONS = USER_QUICK_ACTIONS;

export function isUserNavActive(pathname: string, href: string): boolean {
  if (href === '/home') return pathname === '/home';
  if (href === '/auctions') {
    return pathname === '/auctions';
  }
  if (href === '/profile/my-auctions') {
    return (
      pathname === '/profile/my-auctions' ||
      pathname.startsWith('/profile/my-auctions/')
    );
  }
  if (href === '/profile/wallet') {
    return (
      pathname === '/profile/wallet' || pathname.startsWith('/profile/wallet/')
    );
  }
  if (href === '/profile/payments') {
    return (
      pathname === '/profile/payments' ||
      pathname.startsWith('/profile/payments/')
    );
  }
  if (href === '/profile/notifications') {
    return (
      pathname === '/profile/notifications' ||
      pathname.startsWith('/profile/notifications/')
    );
  }
  if (href === '/profile') {
    if (pathname === '/profile') return true;
    if (!pathname.startsWith('/profile/')) return false;
    const excluded = [
      '/profile/my-auctions',
      '/profile/wallet',
      '/profile/payments',
      '/profile/notifications',
      '/profile/subscription',
    ];
    return !excluded.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** @deprecated Use isUserNavActive */
export const isMainNavActive = isUserNavActive;

export function isSellerNavActive(pathname: string, href: string): boolean {
  if (href === '/seller/dashboard') {
    return pathname === '/seller/dashboard';
  }
  if (href === '/seller/auctions') {
    return pathname === '/seller/auctions' || isSellerAuctionRoomPath(pathname);
  }
  if (href === '/seller/auction/create') {
    return pathname === '/seller/auction/create';
  }
  if (href === '/seller/payments') {
    return (
      pathname === '/seller/payments' ||
      pathname.startsWith('/seller/payments/')
    );
  }
  if (href === '/seller/auction/categories') {
    return pathname.startsWith('/seller/auction/categories');
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isHomeArea(pathname: string): boolean {
  return !pathname.startsWith('/seller');
}

/** Seller dashboard and tools — any route under `/seller`. */
export function isSellerArea(pathname: string): boolean {
  return pathname.startsWith('/seller');
}

/** User home, browse, profile, and bidder auction room (not seller dashboard). */
export function isUserHomeArea(pathname: string): boolean {
  return !pathname.startsWith('/seller');
}

export function isUserRoomNavActive(
  pathname: string,
  item: UserRoomNavItem
): boolean {
  if (item.id === 'auction-room') return isUserAuctionRoomPath(pathname);
  if (item.id === 'all-auctions') return pathname === '/auctions';
  if (item.id === 'bids') return false;
  if (item.id === 'settings') return pathname === '/profile';
  if (item.href === '/profile/notifications') {
    return (
      pathname === '/profile/notifications' ||
      pathname.startsWith('/profile/notifications/')
    );
  }
  if (item.href === '/profile/payments') {
    return (
      pathname === '/profile/payments' ||
      pathname.startsWith('/profile/payments/')
    );
  }
  return isUserNavActive(pathname, item.href);
}

export function isSellerRoomNavActive(
  pathname: string,
  item: SellerRoomNavItem
): boolean {
  if (item.id === 'auction-room') return isSellerAuctionRoomPath(pathname);
  if (item.id === 'auctions') {
    return pathname === '/seller/auctions';
  }
  if (item.href === '/seller/dashboard')
    return pathname === '/seller/dashboard';
  if (item.href === '/seller/payments') {
    return (
      pathname === '/seller/payments' ||
      pathname.startsWith('/seller/payments/')
    );
  }
  if (item.href === '/profile') {
    return pathname === '/profile' || pathname.startsWith('/profile/');
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
