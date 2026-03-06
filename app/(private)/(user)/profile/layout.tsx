'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Gavel, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/profile/my-auctions', label: 'My Auctions', icon: Gavel },
    {
      href: '/profile/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="sticky top-20">
            <nav className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-accent hover:shadow-sm'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </div>
                    {link.badge && link.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Connection Status Indicator */}
              <div className="mt-4 px-4 py-2 rounded-lg bg-muted">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    )}
                  />
                  <span className="text-muted-foreground">
                    {isConnected ? 'Live updates active' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="col-span-12 md:col-span-9">
          <div className="bg-card rounded-lg shadow-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
