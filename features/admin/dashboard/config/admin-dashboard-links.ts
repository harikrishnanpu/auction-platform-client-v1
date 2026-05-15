import type { LucideIcon } from 'lucide-react';
import {
  CreditCard,
  Gavel,
  LayoutGrid,
  Settings,
  ShieldAlert,
  Store,
  UserX,
  Users,
} from 'lucide-react';

export interface AdminQuickLinkDef {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const ADMIN_DASHBOARD_QUICK_LINKS: AdminQuickLinkDef[] = [
  {
    href: '/admin/users',
    title: 'Users',
    description: 'Search, roles, and account status',
    icon: Users,
  },
  {
    href: '/admin/sellers',
    title: 'Sellers',
    description: 'KYC review and seller profiles',
    icon: Store,
  },
  {
    href: '/admin/auctions',
    title: 'Auctions',
    description: 'Browse and moderate listings',
    icon: Gavel,
  },
  {
    href: '/admin/auctions/requests',
    title: 'Category requests',
    description: 'Approve or reject new categories',
    icon: LayoutGrid,
  },
  {
    href: '/admin/reports',
    title: 'Fraud reports',
    description: 'Review flagged activity',
    icon: ShieldAlert,
  },
  {
    href: '/admin/config',
    title: 'System config',
    description: 'Keys, limits, and platform settings',
    icon: Settings,
  },
  {
    href: '/admin/subscriptions',
    title: 'Subscriptions',
    description: 'Plans, features, subscribers',
    icon: CreditCard,
  },
  {
    href: '/admin/users/suspended',
    title: 'Suspended users',
    description: 'Suspension history and appeals',
    icon: UserX,
  },
];
