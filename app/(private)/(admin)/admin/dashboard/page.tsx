import { getAdminDashboardStatsAction } from '@/actions/admin/admin.actions';
import { AdminDashboardView } from '@/features/admin/dashboard/components/admin-dashboard-view';
import type { IAdminDashboardStats } from '@/types/admin-dashboard.type';

const EMPTY_STATS: IAdminDashboardStats = {
  totalUsers: 0,
  suspendedUsers: 0,
  activeSellers: 0,
  pendingKyc: 0,
  totalAuctions: 0,
  liveAuctions: 0,
  upcomingAuctions: 0,
  endedAuctions: 0,
  buyerUsers: 0,
  adminUsers: 0,
};

export default async function AdminDashboardPage() {
  const statsRes = await getAdminDashboardStatsAction();
  const stats: IAdminDashboardStats = {
    ...EMPTY_STATS,
    ...(statsRes.success && statsRes.data ? statsRes.data : {}),
  };
  const errorMessage = statsRes.success ? null : statsRes.error;

  return <AdminDashboardView stats={stats} errorMessage={errorMessage} />;
}
