'use client';

import useUserStore from '@/store/user.store';
import { CreditCard, Wallet, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { BrowseAuctionListItem } from '@/types/auction.type';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type DashboardProps = {
  auctions: BrowseAuctionListItem[];
  loading: boolean;
  error: string | null;
};

export function DashboardView({ auctions }: DashboardProps) {
  const router = useRouter();
  const { user } = useUserStore();

  const activeAuctionsCount = 0;
  const endingSoonCount = 0;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 mt-8 space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-sm">
          <CardHeader className="z-10 relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em]">
                Market Open
              </p>
            </div>
            <h1 className="text-2xl md:text-3xl text-foreground mb-3 leading-snug">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </h1>
            <CardDescription>
              <p className="text-xs md:text-sm text-muted-foreground">
                You&apos;re currently watching{' '}
                <span className="font-medium text-foreground">
                  {activeAuctionsCount} live auctions
                </span>
                {endingSoonCount > 0 && (
                  <>
                    {' '}
                    ·{' '}
                    <span className="font-medium text-foreground">
                      {endingSoonCount} ending in the next 24 hours
                    </span>
                  </>
                )}
                .
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Active: {activeAuctionsCount}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Ending soon: {endingSoonCount}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  Watchlist: coming soon
                </span>
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="z-10 relative mt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => router.push('/auctions')}
              className="bg-foreground hover:bg-foreground/90 text-background px-4 py-2 rounded-xl text-xs md:text-sm font-medium shadow-lg transition flex items-center gap-2 group"
            >
              Explore Auctions{' '}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Button>
            <Button
              onClick={() => router.push('/seller/landing')}
              className="bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-foreground px-4 py-2 rounded-xl text-xs md:text-sm font-medium border border-white/20 transition backdrop-blur-sm align-middle flex items-center gap-2 group shadow-sm cursor-pointer"
            >
              Seller Hub
              <ArrowRight size={14} />
            </Button>
          </CardContent>
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-overlay" />
        </Card>

        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl flex flex-col justify-between shadow-sm relative overflow-hidden">
          <CardContent>
            <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-5 text-foreground">
              <Wallet size={80} strokeWidth={1} />
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <div className="p-2 bg-white/60 dark:bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                  <CreditCard className="text-foreground" size={20} />
                </div>
                <span className="text-[10px] md:text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-2.5 py-1 rounded-full border border-green-200 dark:border-green-800">
                  +12.5%
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Balance
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mt-1 tracking-tight tabular-nums font-outfit">
                ₹ 42,500
              </h2>
            </div>
            <div className="mt-6 pt-4 border-t border-border/50 grid grid-cols-2 gap-4 relative z-10">
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-[0.18em]">
                  Wins
                </p>
                <p className="text-xl md:text-2xl font-semibold text-foreground font-outfit">
                  14
                </p>
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-[0.18em]">
                  Pending
                </p>
                <p className="text-xl md:text-2xl font-semibold text-foreground font-outfit">
                  03
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl md:text-2xl font-semibold text-foreground">
              Live Auctions
            </h3>
            <button
              type="button"
              onClick={() => router.push('/auctions')}
              className="text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground transition flex items-center gap-1 group"
            >
              View all auctions{' '}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
