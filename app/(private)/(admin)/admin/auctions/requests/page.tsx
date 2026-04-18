import {
  getAdminAuctionCategoriesAction,
  getAuctionCategoryRequestsAction,
} from '@/actions/admin/auction-category.actions';
import { AdminAuctionCategoryRequestsView } from '@/features/admin/auctions/components/categories/requests-view';

export default async function AdminAuctionCategoryRequestsPage() {
  const [categoriesRes, requestsRes] = await Promise.all([
    getAdminAuctionCategoriesAction(),
    getAuctionCategoryRequestsAction(),
  ]);

  const categories = categoriesRes.data?.categories ?? [];
  const requests = requestsRes.data?.categories ?? [];
  const error = categoriesRes.error ?? requestsRes.error ?? null;

  return (
    <AdminAuctionCategoryRequestsView
      requests={requests}
      categories={categories}
      error={error}
    />
  );
}
