import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { SellerAuctionCategoriesAll } from '@/features/seller/auction/categories/components/seller-auction-categories-all';

export default async function SellerAuctionCategoriesPage() {
  const res = await getAuctionCategoriesForSellerAction();
  return (
    <SellerAuctionCategoriesAll
      categories={res.success ? (res.data?.categories ?? []) : []}
      error={res.success ? null : res.error}
    />
  );
}
