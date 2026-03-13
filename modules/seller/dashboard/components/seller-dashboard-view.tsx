'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Download,
  TrendingUp,
  CheckCircle,
  Clock,
  Gavel,
  ChevronRight,
  Landmark,
  LifeBuoy,
  CreditCard,
} from 'lucide-react';

import { StatCard } from './stat-card';
import { SettlementRow } from './settlement-row';
import { RevenueBarChart } from './revenue-bar-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DUMMY_DASHBOARD_STATS,
  DUMMY_AUCTIONS,
  type DummyAuctionItem,
} from '../data/dummy-dashboard.data';

function statusLabel(item: DummyAuctionItem): string {
  if (item.status === 'DRAFT') return 'Draft';
  if (item.status === 'ACTIVE') return 'Active';
  return 'Ended';
}

export function SellerDashboardView() {
  const router = useRouter();
  const recentListings = DUMMY_AUCTIONS.slice(0, 5);
  const activeCount = DUMMY_AUCTIONS.filter(
    (a) => a.status === 'ACTIVE' || a.status === 'DRAFT'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans antialiased">
      <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-500">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-2">
              Earnings & Settlements
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Track your sales performance, payouts, and pending settlements.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Export
            </Button>
            <Button asChild size="sm">
              <Link href="/seller/auction/create">
                <Gavel size={16} className="mr-2" />
                Create Auction
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={DUMMY_DASHBOARD_STATS.totalEarnings}
            subtext="vs last month"
            trend={DUMMY_DASHBOARD_STATS.totalEarningsTrend}
            icon={TrendingUp}
            colorClass="bg-emerald-500 text-emerald-500"
            delay="0ms"
          />

          <div
            className="bg-slate-900 dark:bg-blue-600 p-6 rounded-2xl shadow-lg shadow-slate-900/20 dark:shadow-blue-900/20 text-white relative overflow-hidden group animate-fade-in-up"
            style={{ animationDelay: '100ms' }}
          >
            <div className="absolute right-0 bottom-0 h-32 w-32 bg-white/10 rounded-tl-full -mr-8 -mb-8 transition-transform group-hover:scale-105" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-300 dark:text-blue-100">
                  Withdrawable Balance
                </p>
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <CheckCircle size={18} className="text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">
                {DUMMY_DASHBOARD_STATS.withdrawableBalance}
              </h2>
              <div className="flex items-center mt-2 text-sm text-slate-300 dark:text-blue-100">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
                <span>Available now</span>
              </div>
            </div>
          </div>

          <StatCard
            title="Pending Clearance"
            value={DUMMY_DASHBOARD_STATS.pendingClearance}
            subtext={DUMMY_DASHBOARD_STATS.pendingClearanceSubtext}
            icon={Clock}
            colorClass="bg-amber-500 text-amber-500"
            delay="200ms"
          />
          <StatCard
            title="Active Lots Value"
            value={DUMMY_DASHBOARD_STATS.activeLotsValue}
            subtext={`${activeCount} Active Auctions`}
            icon={Gavel}
            colorClass="bg-blue-500 text-blue-500"
            delay="300ms"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden rounded-2xl">
              <CardHeader className="border-b bg-muted/50 flex flex-row justify-between items-center space-y-0 py-5">
                <CardTitle className="text-lg font-serif">
                  Recent Listings
                </CardTitle>
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary p-0 h-auto"
                  asChild
                >
                  <Link href="#" className="flex items-center gap-1">
                    View All History
                    <ChevronRight size={16} className="shrink-0" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {recentListings.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      No auctions yet. Create one to get started!
                    </div>
                  ) : (
                    recentListings.map((auction) => (
                      <SettlementRow
                        key={auction.id}
                        image={auction.imageUrl}
                        title={auction.title}
                        category={auction.category}
                        date={new Date(auction.startTime).toLocaleDateString()}
                        soldPrice={
                          auction.soldPrice
                            ? `₹ ${auction.soldPrice.toLocaleString()}`
                            : `₹ ${auction.startPrice.toLocaleString()}`
                        }
                        fee={auction.fee ?? '-'}
                        net={auction.net ?? '-'}
                        status={statusLabel(auction)}
                        onClick={() =>
                          router.push(`/seller/auction/${auction.id}`)
                        }
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                <CardTitle className="text-lg font-serif">
                  Monthly Revenue
                </CardTitle>
                <select className="text-xs border border-input rounded-md bg-transparent px-2 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Last 6 Months</option>
                  <option>Year to Date</option>
                </select>
              </CardHeader>
              <CardContent>
                <RevenueBarChart />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-linear-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-black border-0 text-white overflow-hidden">
              <CardContent className="pt-6 relative">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500 opacity-10 rounded-full blur-xl" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                      <Landmark size={20} />
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-white/90 hover:bg-white/20 border border-white/10"
                    >
                      Edit
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-widest">
                    Primary Payout
                  </p>
                  <div className="text-xl font-bold tracking-widest font-mono mb-8 flex gap-2">
                    <span>••••</span>
                    <span>••••</span>
                    <span>••••</span>
                    <span>8832</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                        Bank Name
                      </p>
                      <p className="font-medium text-sm">HDFC Bank Ltd</p>
                    </div>
                    <CreditCard size={32} className="opacity-50" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-serif">
                  Commission Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                <ul className="space-y-4">
                  <li className="flex justify-between items-center text-sm pb-3 border-b">
                    <span className="text-muted-foreground">
                      Closing Fee (&lt; ₹1L)
                    </span>
                    <span className="font-semibold">12%</span>
                  </li>
                  <li className="flex justify-between items-center text-sm pb-3 border-b">
                    <span className="text-muted-foreground">
                      Closing Fee (&gt; ₹1L)
                    </span>
                    <span className="font-semibold">10%</span>
                  </li>
                  <li className="flex justify-between items-center text-sm pb-3 border-b">
                    <span className="text-muted-foreground">Listing Fee</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Free
                    </span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Payout Time</span>
                    <span className="font-semibold">24-48 Hrs</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="#">View Full Policy</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                    <LifeBuoy size={16} />
                  </div>
                  <h4 className="font-bold text-sm">Need Help?</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Have questions about a settlement or fees? Our seller support
                  team is here 24/7.
                </p>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-blue-600 dark:text-blue-400"
                >
                  Contact Support
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
