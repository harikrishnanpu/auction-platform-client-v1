'use client';

import Link from 'next/link';
import {
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Shield,
  CreditCard,
} from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';
import { logoutAction } from '@/actions/auth/auth.actions';
import { useRouter } from 'next/navigation';
import useUserStore from '@/store/user.store';
import { AuthProvider } from '@/types/user.type';
import { useNotifications } from '@/features/user/notifications/hooks/use-notifications';

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useUserStore();
  const {
    notifications,
    totalCount,
    loading: notificationsLoading,
    error: notificationsError,
  } = useNotifications();

  const userInitials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'UN';

  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    router.replace('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const notifRef = notificationRef.current;
    const handleNotificationOutside = (e: MouseEvent) => {
      if (notifRef && !notifRef.contains(e.target as Node))
        setIsNotificationOpen(false);
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    if (isNotificationOpen)
      document.addEventListener('mousedown', handleNotificationOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousedown', handleNotificationOutside);
    };
  }, [isMenuOpen, isNotificationOpen]);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/home"
              className="font-bold text-2xl tracking-tight cursor-pointer   text-foreground"
            >
              HammerDown
            </Link>
            <div className="hidden md:flex space-x-6 text-sm font-medium text-muted-foreground">
              <Link
                href="/home"
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Live Auctions
              </Link>
              <Link
                href="/seller/landing"
                className="hover:text-foreground transition-colors"
              >
                Seller Hub
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Wallet
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="hidden sm:flex p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Search size={20} />
            </button>
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                }}
                className="p-2 text-muted-foreground hover:bg-muted rounded-full relative transition-colors"
              >
                <Bell size={20} />
                {totalCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-4 text-white">
                    {totalCount > 9 ? '9+' : totalCount}
                  </span>
                ) : null}
              </button>
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-hidden bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-2xl z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      Notifications
                    </span>
                    <Link
                      href="/profile/notifications"
                      className="text-xs text-primary hover:underline"
                      onClick={() => setIsNotificationOpen(false)}
                    >
                      View all
                    </Link>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notificationsLoading ? (
                      <p className="px-4 py-3 text-sm text-muted-foreground">
                        Loading notifications...
                      </p>
                    ) : notificationsError ? (
                      <p className="px-4 py-3 text-sm text-red-500">
                        {notificationsError}
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-muted-foreground">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.slice(0, 8).map((notification) => (
                        <div
                          key={notification.id}
                          className="border-b border-border px-4 py-3 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-md border border-white/20">
                  {user?.avatar_url ? (
                    user?.authProvider == AuthProvider.LOCAL ? (
                      <Image
                        className="rounded-full"
                        src={`https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com/${user?.avatar_url}`}
                        alt="avatar_url"
                        width={42}
                        height={42}
                      />
                    ) : (
                      <Image
                        className="rounded-full"
                        src={user?.avatar_url}
                        alt="avatar_url"
                        width={42}
                        height={42}
                      />
                    )
                  ) : (
                    userInitials
                  )}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-border mb-1">
                    <p className="text-sm font-bold text-foreground truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <div className="px-2 space-y-0.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <User
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      Profile Settings
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                        <CreditCard
                          size={16}
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      Billing & Wallet
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                        <Shield
                          size={16}
                          className="text-purple-600 dark:text-purple-400"
                        />
                      </div>
                      Security
                    </Link>
                  </div>

                  <div className="px-2 mt-2 pt-2 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
                    >
                      <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                        <LogOut size={16} />
                      </div>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="ml-2 pl-2 border-l border-border h-6 hidden sm:block"></div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
