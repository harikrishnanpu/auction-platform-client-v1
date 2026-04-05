import { SellerAuctionCategoriesTabs } from '@/features/seller/auction/categories/components/seller-auction-categories-tabs';
import type { ReactNode } from 'react';

export default function SellerAuctionCategoriesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SellerAuctionCategoriesTabs>{children}</SellerAuctionCategoriesTabs>;
}
