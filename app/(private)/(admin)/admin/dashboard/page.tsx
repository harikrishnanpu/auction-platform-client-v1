import Link from 'next/link';
import {
  Users,
  Store,
  ShieldAlert,
  UserX,
  Settings,
  CreditCard,
} from 'lucide-react';
import { getAdminDashboardStatsAction } from '@/actions/admin/admin.actions';
import { AdminDashboardStats } from '@/features/admin/components/admin-dashboard-stats';

export default async function AdminDashboard() {
  const fallbackStats = {
    totalUsers: 0,
    suspendedUsers: 0,
    activeSellers: 0,
    pendingKyc: 0,
    totalAuctions: 0,
    liveAuctions: 0,
  };
  const statsRes = await getAdminDashboardStatsAction();
  const stats = statsRes.success
    ? (statsRes.data ?? fallbackStats)
    : fallbackStats;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        Admin Dashboard
      </h1>

      <AdminDashboardStats stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/users"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Users
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage users, roles, and permissions
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/sellers"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
              <Store size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Sellers
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage sellers and KYC verification
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/auctions"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
              <Store size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Auctions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage sellers and KYC verification
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reports"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fraud Reports
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Review and verify user fraud reports
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/config"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-lg group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Config
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Edit backend constants and thresholds
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/subscriptions"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Subscriptions
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage plans, features and subscribed users
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/users/suspended"
          className="block p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
              <UserX size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suspended Users
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View temporary/permanent suspension timeline
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
