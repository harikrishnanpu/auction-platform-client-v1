import { getFraudReportsAction } from '@/actions/admin/report.actions';
import { ReportManagementView } from '@/features/admin/reports/components/report-management-view';
import { parseReportFilters } from '@/lib/admin-search-params';

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const { filters, page } = parseReportFilters(params);
  const res = await getFraudReportsAction({
    page,
    limit: filters.limit,
    search: filters.search,
    status: filters.status === 'ALL' ? undefined : filters.status,
    sort: 'createdAt',
    order: 'desc',
  });

  return (
    <ReportManagementView
      filters={filters}
      page={page}
      reports={res.success ? (res.data?.reports ?? []) : []}
      total={res.success ? (res.data?.total ?? 0) : 0}
      totalPages={res.success ? (res.data?.totalPages ?? 1) : 1}
      error={res.success ? null : (res.error ?? 'Failed to load reports')}
    />
  );
}
