import { AdminAuctionCategoriesView } from '@/features/admin/auctions/components/categories/categories-view';
import { getAdminAuctionCategoriesAction } from '@/actions/admin/auction-category.actions';

export default async function AdminAuctionCategoriesPage() {
  const res = await getAdminAuctionCategoriesAction();

  const categories = res.success ? (res.data?.categories ?? []) : [];

  console.log(res);
  return (
    <AdminAuctionCategoriesView
      activeTab="categories"
      categories={categories}
      error={res.success ? null : res.error}
    />
  );
}
