import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { SellerAuctionCategoriesView } from '@/modules/seller/auction/categories/components/seller-categories-view';

export default async function SellerAuctionCategoryRequestPage() {
  const res = await getAuctionCategoriesForSellerAction();
  return (
    <SellerAuctionCategoriesView
      tab="request"
      categories={res.success ? (res.data?.categories ?? []) : []}
      error={res.success ? null : res.error}
    />
  );
}
