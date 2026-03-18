import { ComingSoon } from '@/components/coming-soon';

export default async function EditSellerAuctionPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  if (!id) return null;

  return (
    <ComingSoon
      title="No content"
      description={`Editing seller auction ${id} is coming soon.`}
      homeHref="/seller/dashboard"
    />
  );
}
