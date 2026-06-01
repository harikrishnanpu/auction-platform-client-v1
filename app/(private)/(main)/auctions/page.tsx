import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getBrowseAuctionsAction } from '@/actions/auction/auction.actions';
import { AuctionsBrowseView } from '@/features/user/auctions/components/auctions-browse-view';
import { parseBrowseFilters } from '@/lib/listing-search-params';
import type { AuctionCategory } from '@/types/auction.type';

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const filters = parseBrowseFilters(params);

  const [categoriesRes, auctionsRes] = await Promise.all([
    getAuctionCategoriesForSellerAction(),
    getBrowseAuctionsAction(filters),
  ]);

  const categories: AuctionCategory[] =
    categoriesRes.success && categoriesRes.data?.categories
      ? categoriesRes.data.categories
      : [];

  return (
    <AuctionsBrowseView
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
