import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';
import { getSellerAuctionByIdAction } from '@/actions/auction/auction.actions';
import { SellerAuctionEditDraftContainer } from '@/features/seller/auction/components/seller-auction-edit-draft-container';

export default async function EditSellerAuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const auctionRes = await getSellerAuctionByIdAction(id);
  if (!auctionRes.success || !auctionRes.data) return null;

  if (auctionRes.data.status !== 'DRAFT') {
    // Only draft auctions can be edited.
    return null;
  }

  const categoriesRes = await getAuctionCategoriesForSellerAction();
  const categories = categoriesRes.success
    ? (categoriesRes.data?.categories ?? [])
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-3 py-6">
        <SellerAuctionEditDraftContainer
          auction={auctionRes.data}
          categories={categories}
        />
      </div>
    </div>
  );
}
