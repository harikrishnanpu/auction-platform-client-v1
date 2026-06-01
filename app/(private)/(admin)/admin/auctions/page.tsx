import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getAdminAuctionsAction } from '@/actions/admin/auction.actions';
import { AdminAuctionsBrowseView } from '@/features/admin/auctions/components/admin-auctions-browse-view';
import { parseAdminAuctionFilters } from '@/lib/listing-search-params';
import type { AuctionCategory } from '@/types/auction.type';

export default async function AdminAuctionsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const filters = parseAdminAuctionFilters(params);

  const [categoriesRes, auctionsRes] = await Promise.all([
    getAuctionCategoriesForSellerAction(),
    getAdminAuctionsAction(filters),
  ]);

  const categories: AuctionCategory[] =
    categoriesRes.success && categoriesRes.data?.categories
      ? categoriesRes.data.categories
      : [];

  return (
    <AdminAuctionsBrowseView
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
