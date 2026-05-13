'use client';

import {
  Activity,
  FileCheck,
  Gavel,
  ShieldAlert,
  Store,
  Users,
} from 'lucide-react';

import type { IAdminDashboardStats } from '@/types/admin-dashboard.type';

import { AdminBentoStat } from './admin-bento-stat';
import { AdminDashboardCharts } from './admin-dashboard-charts';
import { AdminDashboardRail } from './admin-dashboard-rail';

interface AdminDashboardViewProps {
  stats: IAdminDashboardStats;
  errorMessage?: string | null;
}

export function AdminDashboardView({
  stats,
  errorMessage,
}: AdminDashboardViewProps) {
  const auctionSeries = [
    { label: 'Live', count: stats.liveAuctions },
    { label: 'Upcoming', count: stats.upcomingAuctions },
    { label: 'Ended', count: stats.endedAuctions },
  ];

  const userRoleSeries = [
    { label: 'Buyers', count: stats.buyerUsers },
    { label: 'Sellers', count: stats.activeSellers },
    { label: 'Admins', count: stats.adminUsers },
  ];

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 max-w-2xl bg-[radial-gradient(ellipse_75%_55%_at_50%_-15%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)] opacity-80 dark:opacity-100" />

      <div className="relative mx-auto w-full max-w-[min(100%,1580px)] px-4 pb-10 pt-5 sm:px-6 sm:pb-12 sm:pt-6 md:px-8 lg:px-10">
        <header className="mb-6 border-b border-border/70 pb-4 sm:mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            Admin dashboard
          </h1>
        </header>

        {errorMessage ? (
          <div
            className="mb-6 rounded-xl border border-amber-500/35 bg-amber-500/8 px-3.5 py-2.5 text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-50 sm:px-4"
            role="alert"
          >
            <p className="text-sm font-semibold">Could not refresh metrics</p>
            <p className="mt-1 text-xs leading-relaxed text-amber-900/90 dark:text-amber-100/90 sm:text-sm">
              {errorMessage} Values default to zero until the request succeeds.
            </p>
          </div>
        ) : null}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <AdminDashboardRail />

          <div className="min-w-0 flex-1 space-y-7 lg:space-y-8">
            <section aria-labelledby="metrics-heading">
              <h2
                id="metrics-heading"
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Metrics
              </h2>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 md:grid-cols-12 md:gap-3">
                <AdminBentoStat
                  variant="hero"
                  className="md:col-span-5"
                  label="Registered accounts"
                  value={stats.totalUsers}
                  caption="Everyone with a login: buyers, sellers, and staff."
                  icon={Users}
                />
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:col-span-7">
                  <AdminBentoStat
                    variant="accent"
                    label="Live listings"
                    value={stats.liveAuctions}
                    caption="Bidding open"
                    icon={Activity}
                  />
                  <AdminBentoStat
                    variant="accent"
                    label="KYC queue"
                    value={stats.pendingKyc}
                    caption="Pending review"
                    icon={FileCheck}
                  />
                  <AdminBentoStat
                    label="Suspended"
                    value={stats.suspendedUsers}
                    caption="On hold"
                    icon={ShieldAlert}
                  />
                  <AdminBentoStat
                    label="Seller roles"
                    value={stats.activeSellers}
                    caption="Seller role count"
                    icon={Store}
                  />
                  <AdminBentoStat
                    className="col-span-2"
                    label="Published listings"
                    value={stats.totalAuctions}
                    caption="Non-draft catalog size"
                    icon={Gavel}
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="charts-heading">
              <h2
                id="charts-heading"
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground"
              >
                Distribution
              </h2>
              <AdminDashboardCharts
                auctionSeries={auctionSeries}
                userRoleSeries={userRoleSeries}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
