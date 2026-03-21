import { CreateAuctionContainer } from '@/modules/seller/auction/components/create-auction-container';
import { getAuctionCategoriesForSellerAction } from '@/actions/auction-category/auction-category.actions';

export default async function CreateAuctionPage() {
  const res = await getAuctionCategoriesForSellerAction();
  const categories = res.success ? (res.data?.categories ?? []) : [];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans antialiased">
      <CreateAuctionContainer categories={categories} />
    </div>
  );
}
