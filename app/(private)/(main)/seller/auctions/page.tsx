import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getSellerAuctionsAction } from '@/actions/auction/auction.actions';
import { SellerAuctionsListView } from '@/features/seller/auction/components/seller-auctions-list-view';
import { parseSellerAuctionFilters } from '@/lib/listing-search-params';
import type { AuctionCategory } from '@/types/auction.type';

export default async function SellerAuctionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const filters = parseSellerAuctionFilters(params);

  const [categoriesRes, auctionsRes] = await Promise.all([
    getAuctionCategoriesForSellerAction(),
    getSellerAuctionsAction(filters),
  ]);

  const categories: AuctionCategory[] =
    categoriesRes.success && categoriesRes.data?.categories
      ? categoriesRes.data.categories
      : [];

  return (
    <SellerAuctionsListView
      filters={filters}
      categories={categories}
      response={auctionsRes.success ? (auctionsRes.data ?? null) : null}
      error={
        auctionsRes.success
          ? null
          : (auctionsRes.error ?? 'Failed to load auctions')
      }
    />
  );
}
