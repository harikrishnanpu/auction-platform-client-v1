import { getAllSellerAuctionCategoryRequestAction } from '@/actions/seller/seller.action';
import { SellerAuctionMyCategoryRequests } from '@/features/seller/auction/categories/components/seller-auction-my-category-requests';

export default async function SellerAuctionCategoryRequestsPage() {
  const res = await getAllSellerAuctionCategoryRequestAction();

  console.log(res);

  return (
    <SellerAuctionMyCategoryRequests
      requests={res.success ? (res.data?.categories ?? []) : []}
      error={res.success ? null : res.error}
    />
  );
}
