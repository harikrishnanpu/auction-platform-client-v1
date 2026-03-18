'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

import { requestAuctionCategoryAction } from '@/actions/auction-category/auction-category.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { flattenCategoryTree } from '@/modules/admin/auctions/components/categories/category-utils';
import { AuctionCategory } from '@/types/auction.type';
import { getErrorMessage } from '@/utils/get-app-error';
import { toast } from 'sonner';

export function SellerAuctionCategoriesView({
  tab,
  categories,
  error,
}: {
  tab: 'categories' | 'request';
  categories: AuctionCategory[];
  error?: string | null;
}) {
  const router = useRouter();
  const verified = useMemo(
    () => categories.filter((c) => c.isVerified),
    [categories]
  );
  const verifiedRows = useMemo(() => flattenCategoryTree(verified), [verified]);

  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const options = useMemo(
    () =>
      verifiedRows.map((c) => ({
        id: c.id,
        label: `${'— '.repeat(c.depth)}${c.pathLabel}`,
      })),
    [verifiedRows]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    router.refresh();
    setRefreshing(false);
  };

  const onSubmit = async () => {
    const trimmed = name.trim();

    if (!trimmed) {
      toast.error('Please enter a category name.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await requestAuctionCategoryAction({
        name: trimmed,
        parentId: parentId || null,
      });
      if (!res.success) throw new Error(res.error ?? 'Request failed');
      toast.success('Category request submitted for review.');
      setName('');
      setParentId('');
      router.push('/seller/auction/categories');
      router.refresh();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Auction categories
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Choose a verified category or request a new one.
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCw className={cn('size-4', refreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      <Tabs value={tab}>
        <TabsList>
          <TabsTrigger asChild value="categories">
            <Link href="/seller/auction/categories">Categories</Link>
          </TabsTrigger>
          <TabsTrigger asChild value="request">
            <Link href="/seller/auction/categories/request">
              Request category
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === 'categories' ? (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Verified categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : verifiedRows.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No verified categories found.
              </p>
            ) : (
              <ul className="space-y-1 text-sm">
                {verifiedRows.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 border border-border bg-background/50"
                  >
                    <span className="text-slate-500 dark:text-slate-400">
                      {c.depth ? '—'.repeat(c.depth) : ''}
                    </span>
                    <span className="font-semibold text-foreground">
                      {c.pathLabel}
                    </span>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">
                      {c.slug}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Request a new category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="catName">Category name</Label>
              <Input
                id="catName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Luxury Watches"
                className="mt-1"
                disabled={submitting}
              />
            </div>

            <div>
              <Label htmlFor="parent">Parent (optional)</Label>
              <select
                id="parent"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                disabled={submitting}
                className="mt-1 w-full h-12 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                <option value="">No parent (root)</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={onSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit request'}
              </Button>
              <Button variant="outline" asChild disabled={submitting}>
                <Link href="/seller/auction/create">
                  Back to create auction
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
