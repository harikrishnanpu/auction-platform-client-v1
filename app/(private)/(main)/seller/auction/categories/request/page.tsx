import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { SellerAuctionCategoryRequestForm } from '@/modules/seller/auction/categories/components/seller-auction-category-request-form';

export default async function SellerAuctionCategoryRequestPage() {
  const res = await getAuctionCategoriesForSellerAction();
  return (
    <SellerAuctionCategoryRequestForm
      categories={res.success ? (res.data?.categories ?? []) : []}
      error={res.success ? null : res.error}
    />
  );
}
