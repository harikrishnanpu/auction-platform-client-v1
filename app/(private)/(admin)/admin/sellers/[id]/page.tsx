import { getAdminSellerAction } from '@/actions/admin/admin.actions';
import { SellerDetailView } from '@/features/admin/sellers/components/seller-detail-view';

export default async function SellerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getAdminSellerAction(id);

  return (
    <SellerDetailView
      seller={res.success ? (res.data ?? null) : null}
      error={
        res.success ? null : (res.error ?? 'Failed to load seller details.')
      }
    />
  );
}
