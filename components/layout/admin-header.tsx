'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Search, Bell, Sun, Moon } from 'lucide-react';

export function AdminHeader() {
  const { theme, setTheme } = useTheme();
  // Safe toggle for hydration mismatch prevention
  const isDark = theme === 'dark';

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-border bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/home"
              className="font-bold text-xl tracking-tight   text-foreground"
            >
              HammerDown
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
              <Link
                href="/admin/dashboard"
                className="text-foreground font-semibold transition-colors"
              >
                Admin Panel
              </Link>
              <Link
                href="/admin/auctions"
                className="hover:text-foreground transition-colors"
              >
                Auctions
              </Link>
              <Link
                href="/admin/risks"
                className="hover:text-foreground transition-colors"
              >
                Risks & Fraud
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 ring-2 ring-background cursor-pointer"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
