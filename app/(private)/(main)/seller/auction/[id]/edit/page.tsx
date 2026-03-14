'use client';

import { use } from 'react';
import { EditDraftAuctionForm } from '@/modules/seller/auction/components/edit-draft-auction-form';

export default function EditSellerAuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  if (!id) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">
            Edit Draft Auction
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Update the details of your draft auction. Media files cannot be
            modified after initial creation.
          </p>
        </div>
        <EditDraftAuctionForm auctionId={id} />
      </main>
    </div>
  );
}
