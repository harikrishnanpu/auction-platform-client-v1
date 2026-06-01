import { getAllSellersAction } from '@/actions/admin/admin.actions';
import { SellerManagementView } from '@/features/admin/sellers/components/seller-management-view';
import { parseAdminSellerListParams } from '@/lib/admin-search-params';

export default async function SellerManagementPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const { page, limit, pendingOnly } = parseAdminSellerListParams(params);
  const res = await getAllSellersAction({
    page,
    limit,
    ...(pendingOnly ? { pendingOnly: true } : {}),
  });

  return (
    <SellerManagementView
      page={page}
      limit={limit}
      pendingOnly={pendingOnly}
      sellers={res.success ? (res.data?.sellers ?? []) : []}
      totalPages={res.success ? (res.data?.totalPages ?? 1) : 1}
      totalSellers={res.success ? (res.data?.total ?? 0) : 0}
      error={res.success ? null : (res.error ?? 'Failed to load sellers')}
    />
  );
}
