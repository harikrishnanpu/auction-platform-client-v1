'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, FolderTree, Inbox, RefreshCw } from 'lucide-react';

import {
  setAuctionCategoryStatusAction,
  updateAuctionCategoryAction,
} from '@/actions/admin/auction-category.actions';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AuctionCategory, AuctionCategoryStatus } from '@/types/auction.type';
import { flattenCategoryTree, FlattenedCategoryRow } from './category-utils';
import { CategoryParentOption, EditCategoryModal } from './category-modals';
import { toast } from 'sonner';

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <div>
      <Badge
        className={cn(
          isActive
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        )}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    </div>
  );
}

export function AdminAuctionCategoriesView({
  activeTab,
  categories,
  error,
}: {
  activeTab: 'categories' | 'requests';
  categories: AuctionCategory[];
  error?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<FlattenedCategoryRow | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | AuctionCategoryStatus
  >('ALL');

  const rows = useMemo(() => flattenCategoryTree(categories), [categories]);
  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const okStatus =
        statusFilter === 'ALL' ? true : r.status === statusFilter;
      if (!okStatus) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.pathLabel.toLowerCase().includes(q)
      );
    });
  }, [rows, query, statusFilter]);

  const parentOptions: CategoryParentOption[] = useMemo(() => {
    return rows.map((r) => ({ id: r.id, label: r.pathLabel }));
  }, [rows]);

  const openEdit = useCallback((row: FlattenedCategoryRow) => {
    setEditing(row);
    setEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditing(null);
  }, []);

  const toggleStatus = useCallback(
    async (row: FlattenedCategoryRow) => {
      setBusyId(row.id);
      const newStatus = row.isActive ? false : true;
      const res = await setAuctionCategoryStatusAction(row.id, newStatus);
      if (!res.success) {
        toast.error(res.error ?? 'Failed to update category status');
        setBusyId(null);
        return;
      }
      toast.success(`Category status updated to ${newStatus}`);
      startTransition(() => router.refresh());
      setBusyId(null);
    },
    [router, startTransition]
  );

  const columns: Column<FlattenedCategoryRow>[] = useMemo(
    () => [
      {
        header: 'Category',
        cell: (row) => (
          <div className="min-w-[240px]">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${row.depth * 14}px` }}
            >
              <FolderTree className="size-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">
                  {row.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {row.pathLabel}
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        header: 'Slug',
        cell: (row) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.slug}
          </span>
        ),
      },
      {
        header: 'Status',
        cell: (row) => <StatusBadge isActive={row.isActive} />,
      },
      {
        header: 'Parent',
        cell: (row) => (
          <span className="text-sm text-muted-foreground">
            {row.parentId ? 'Child' : 'Root'}
          </span>
        ),
      },
      {
        header: 'Actions',
        className: 'text-right',
        cell: (row) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEdit(row)}
              className="gap-2"
              disabled={isPending || busyId === row.id}
            >
              <Edit className="size-4" />
              Edit
            </Button>
            <Button
              variant={row.isActive ? 'destructive' : 'default'}
              size="sm"
              onClick={() => toggleStatus(row)}
              className="gap-2"
              disabled={isPending || busyId === row.id}
            >
              {row.isActive ? 'Make inactive' : 'Make active'}
            </Button>
          </div>
        ),
      },
    ],
    [busyId, isPending, openEdit, toggleStatus]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    router.refresh();
    setRefreshing(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background/80 backdrop-blur px-4 sm:px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-foreground">
              Auction categories
            </div>
            <div className="text-sm text-muted-foreground">
              Organized in a hierarchical tree. Root categories appear first,
              then nested children.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw
                className={cn('size-4', refreshing && 'animate-spin')}
              />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name / slug / path..."
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'ALL' | AuctionCategoryStatus)
              }
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <Tabs value={activeTab}>
            <TabsList>
              <TabsTrigger asChild value="categories">
                <Link href="/admin/auctions/categories">All categories</Link>
              </TabsTrigger>
              <TabsTrigger asChild value="requests">
                <Link
                  href="/admin/auctions/requests"
                  className="inline-flex items-center gap-2"
                >
                  <Inbox className="size-4" />
                  Requests
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="text-xs text-muted-foreground">
            {error ? (
              <span className="text-red-600 dark:text-red-400">{error}</span>
            ) : (
              <span>{filteredRows.length} categories</span>
            )}
          </div>
        </div>
      </div>

      <DataTable
        data={filteredRows}
        columns={columns}
        loading={false}
        page={1}
        totalPages={1}
        totalItems={filteredRows.length}
        onPageChange={() => {}}
        emptyMessage={
          error ? 'Could not load categories.' : 'No categories found yet.'
        }
      />

      <EditCategoryModal
        isOpen={editOpen}
        onClose={closeEdit}
        initialName={editing?.name ?? ''}
        initialParentId={editing?.parentId ?? null}
        parentOptions={parentOptions.filter((o) => o.id !== editing?.id)}
        disabled={isPending || !!busyId}
        onSave={async (input) => {
          if (!editing)
            return { success: false, error: 'No category selected' };
          const res = await updateAuctionCategoryAction(editing.id, {
            name: input.name,
            parentId: input.parentId,
          });
          if (!res.success) return { success: false, error: res.error };
          startTransition(() => router.refresh());
          return { success: true };
        }}
      />
    </div>
  );
}
