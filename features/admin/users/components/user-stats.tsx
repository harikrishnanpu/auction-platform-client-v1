import { Users, FileCheck, Store, Gavel } from 'lucide-react';

export function UserStats({
  stats,
}: {
  stats: {
    totalUsers: number;
    pendingKyc: number;
    activeSellers: number;
    suspendedUsers: number;
  } | null;
}) {
  const data = stats || {
    totalUsers: 0,
    pendingKyc: 0,
    activeSellers: 0,
    suspendedUsers: 0,
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Users size={24} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Total Users
          </p>
          <p className="text-xl font-bold text-foreground">{data.totalUsers}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
          <FileCheck size={24} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Pending KYC
          </p>
          <p className="text-xl font-bold text-foreground">{data.pendingKyc}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Store size={24} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Active Sellers
          </p>
          <p className="text-xl font-bold text-foreground">
            {data.activeSellers}
          </p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-border flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
          <Gavel size={24} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Suspended
          </p>
          <p className="text-xl font-bold text-foreground">
            {data.suspendedUsers}
          </p>
        </div>
      </div>
    </div>
  );
}
