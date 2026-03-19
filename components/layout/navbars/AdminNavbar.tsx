'use client';

import { ModeToggle } from '@/components/ui/mode-toggle';
import useUserStore from '@/store/user.store';
import { UserRole } from '@/types/user.type';
import {
  Search,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { logoutAction } from '@/actions/auth/auth.actions';

export function AdminNavbar() {
  const { user, setUser } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLogout = async () => {
    setIsMenuOpen(false);
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

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 bg-[#E9F1FA]/90 dark:bg-[#0f172a]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 font-bold text-xl tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              HammerDown{' '}
              <span className="px-2 py-0.5 rounded text-[10px] font-sans bg-[#111111] text-white uppercase tracking-wider">
                Admin
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Link
                className="hover:text-[#111111] dark:hover:text-white transition-colors"
                href="/admin/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="text-[#090808] dark:text-white font-semibold transition-colors"
                href="/admin/users"
              >
                Users
              </Link>
              <Link
                className="hover:text-[#111111] dark:hover:text-white transition-colors"
                href="#"
              >
                Auctions
              </Link>
              <Link
                className="hover:text-[#111111] dark:hover:text-white transition-colors"
                href="#"
              >
                Financials
              </Link>
              <Link
                className="hover:text-[#111111] dark:hover:text-white transition-colors"
                href="#"
              >
                Risks & Fraud
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search size={18} />
              </span>
              <input
                className="pl-10 pr-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-[#111111] focus:border-[#111111] w-64 transition-all dark:text-white outline-none"
                placeholder="Search command..."
                type="text"
              />
            </div>
            <ModeToggle />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300 shadow-sm">
                  {user?.avatar_url && (
                    <Image
                      alt="Admin"
                      className="h-full w-full object-cover"
                      src={user?.avatar_url ?? ''}
                      width={32}
                      height={32}
                    />
                  )}
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Administrator
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-0.5">
                      Admin User
                    </p>
                  </div>

                  <div className="px-2 space-y-1">
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <User size={16} />
                      View Profile
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                      Admin Settings
                    </Link>
                    <Link
                      href="#"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Shield size={16} />
                      System Logs
                    </Link>
                  </div>

                  <div className="px-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-medium leading-none dark:text-gray-100">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">
                      {user?.roles.some((r: UserRole) => r === UserRole.ADMIN)
                        ? 'Administrator'
                        : 'Staff'}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <LogOut size={16} />
                      Logout Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
