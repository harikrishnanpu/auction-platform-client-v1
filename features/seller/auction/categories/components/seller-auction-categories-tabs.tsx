'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function SellerAuctionCategoriesTabs({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const value = pathname.includes('/seller/auction/categories/request')
    ? 'request'
    : pathname.includes('/seller/auction/categories/my-requests')
      ? 'my-requests'
      : 'categories';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Auction categories
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Choose a verified category or manage your requests.
          </div>
        </div>
      </div>

      <Tabs value={value}>
        <TabsList className={cn('w-full justify-start')}>
          <TabsTrigger asChild value="categories">
            <Link href="/seller/auction/categories">Categories</Link>
          </TabsTrigger>
          <TabsTrigger asChild value="request">
            <Link href="/seller/auction/categories/request">
              Request category
            </Link>
          </TabsTrigger>
          <TabsTrigger asChild value="my-requests">
            <Link href="/seller/auction/categories/my-requests">
              My requests
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
