import Link from 'next/link';
import { Users, Store } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">
        Admin Dashboard
      </h1>

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
      </div>
    </div>
  );
}
