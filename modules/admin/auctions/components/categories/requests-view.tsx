'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Edit, Inbox, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

import {
  approveAuctionCategoryRequestAction,
  rejectAuctionCategoryRequestAction,
  updateAuctionCategoryAction,
} from '@/actions/admin/auction-category.actions';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { AuctionCategory, AuctionCategoryStatus } from '@/types/auction.type';
import { EditCategoryModal, RejectReasonModal } from './category-modals';
import {
  normalizeCategoryStatus,
  useCategoryParentOptions,
  useCategoryTableFilters,
} from './use-admin-categories';

function StatusBadge({ status }: { status: AuctionCategoryStatus }) {
  if (status === 'APPROVED')
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
        Approved
      </Badge>
    );
  if (status === 'REJECTED')
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        Rejected
      </Badge>
    );
  return (
    <Badge
      variant="secondary"
      className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
    >
      Pending
    </Badge>
  );
}

export function AdminAuctionCategoryRequestsView({
  requests,
  categories,
  error,
}: {
  requests: AuctionCategory[];
  categories: AuctionCategory[];
  error?: string | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejecting, setRejecting] = useState<AuctionCategory | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<AuctionCategory | null>(null);
  const { query, setQuery, statusFilter, setStatusFilter, filteredItems } =
    useCategoryTableFilters(requests);

  const approve = useCallback(
    async (id: string) => {
      setBusyId(id);
      const res = await approveAuctionCategoryRequestAction(id);

      if (!res.success) {
        toast.error(res.error ?? 'Failed to approve request');
        setBusyId(null);
        return;
      }

      toast.success('Request approved successfully');
      setBusyId(null);
      startTransition(() => router.refresh());
    },
    [router]
  );

  const openReject = useCallback((r: AuctionCategory) => {
    setRejecting(r);
    setRejectOpen(true);
  }, []);

  const closeReject = useCallback(() => {
    setRejectOpen(false);
    setRejecting(null);
  }, []);

  const openEdit = useCallback((r: AuctionCategory) => {
    setEditing(r);
    setEditOpen(true);
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setEditing(null);
  }, []);

  const handleRefresh = useCallback(
    () => startTransition(() => router.refresh()),
    [router, startTransition]
  );

  const { parentOptions } = useCategoryParentOptions(categories);

  const columns: Column<AuctionCategory>[] = useMemo(
    () => [
      {
        header: 'Requested category',
        cell: (r) => (
          <div className="min-w-[240px]">
            <div className="font-semibold text-foreground">{r.name}</div>
            <div className="text-xs text-muted-foreground font-mono">
              {r.slug}
            </div>
          </div>
        ),
      },
      {
        header: 'Status',
        cell: (r) => <StatusBadge status={normalizeCategoryStatus(r.status)} />,
      },
      {
        header: 'Actions',
        className: 'text-right',
        cell: (r) => {
          const status = normalizeCategoryStatus(r.status);
          const disabled =
            isPending ||
            busyId === r.id ||
            status !== AuctionCategoryStatus.PENDING;
          return (
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => openEdit(r)}
                className="gap-2"
              >
                <Edit className="size-4" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() => approve(r.id)}
                className="gap-2"
              >
                <Check className="size-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={disabled}
                onClick={() => openReject(r)}
                className="gap-2"
              >
                <X className="size-4" />
                Reject
              </Button>
            </div>
          );
        },
      },
    ],
    [approve, busyId, isPending, openEdit, openReject]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-background/80 backdrop-blur px-4 sm:px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-lg font-extrabold text-foreground">
              Category requests
            </div>
            <div className="text-sm text-muted-foreground">
              Seller-submitted categories that need admin approval.
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
            disabled={isPending}
          >
            <RefreshCw className={cn('size-4', isPending && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name / slug..."
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
          <Tabs value="requests">
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
              <span>{filteredItems.length} requests</span>
            )}
          </div>
        </div>
      </div>

      <DataTable
        data={filteredItems}
        columns={columns}
        loading={false}
        page={1}
        totalPages={1}
        totalItems={filteredItems.length}
        onPageChange={() => {}}
        emptyMessage={
          error ? 'Could not load requests.' : 'No category requests found.'
        }
      />

      <RejectReasonModal
        isOpen={rejectOpen}
        onClose={closeReject}
        subjectLabel={
          rejecting ? `${rejecting.name} (${rejecting.slug})` : undefined
        }
        disabled={isPending || !!busyId}
        onSubmit={async (reason) => {
          if (!rejecting)
            return { success: false, error: 'No request selected' };
          setBusyId(rejecting.id);
          const res = await rejectAuctionCategoryRequestAction(
            rejecting.id,
            reason
          );
          if (!res.success) {
            setBusyId(null);
            return { success: false, error: res.error };
          }
          startTransition(() => router.refresh());
          setBusyId(null);
          return { success: true };
        }}
      />

      <EditCategoryModal
        isOpen={editOpen}
        title="Edit requested category"
        description="Adjust name and parent before approving."
        onClose={closeEdit}
        initialName={editing?.name ?? ''}
        initialParentId={editing?.parentId ?? null}
        parentOptions={parentOptions}
        disabled={isPending || !!busyId}
        onSave={async (input) => {
          if (!editing) return { success: false, error: 'No request selected' };
          setBusyId(editing.id);
          const res = await updateAuctionCategoryAction(editing.id, {
            name: input.name,
            parentId: input.parentId,
          });
          if (!res.success) {
            setBusyId(null);
            return { success: false, error: res.error };
          }
          startTransition(() => router.refresh());
          setBusyId(null);
          return { success: true };
        }}
      />
    </div>
  );
}
