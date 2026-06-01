'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SellerTable } from './seller-table';
import { blockUserAction } from '@/actions/admin/admin.actions';
import { SellerInfo } from '@/services/admin/admin.service';
import { ADMIN_USER_MESSAGES } from '@/constants/admin/messages.constants';
import { buildAdminSellerListSearchParams } from '@/lib/admin-search-params';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchInput } from '@/components/ui/search-input';

const LIMIT_OPTIONS = [5, 10, 20, 50] as const;

type SellerManagementViewProps = {
  page: number;
  limit: number;
  pendingOnly: boolean;
  sellers: SellerInfo[];
  totalPages: number;
  totalSellers: number;
  error: string | null;
};

export function SellerManagementView({
  page,
  limit,
  pendingOnly,
  sellers,
  totalPages,
  totalSellers,
  error,
}: SellerManagementViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');

  function navigate(next: {
    page: number;
    limit: number;
    pendingOnly: boolean;
  }) {
    const query = buildAdminSellerListSearchParams(next);
    startTransition(() => {
      router.push(query ? `/admin/sellers?${query}` : '/admin/sellers');
    });
  }

  const filteredSellers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sellers;
    return sellers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [sellers, search]);

  const handleLimitChange = (value: string) => {
    navigate({ page: 1, limit: Number(value), pendingOnly });
  };

  const handlePendingOnlyChange = (checked: boolean) => {
    navigate({ page: 1, limit, pendingOnly: checked });
  };

  const handleBlockUser = async (id: string, block: boolean) => {
    const res = await blockUserAction(id, block);

    if (res.success) {
      toast.success(
        block ? ADMIN_USER_MESSAGES.BLOCKED : ADMIN_USER_MESSAGES.UNBLOCKED
      );
      router.refresh();
    } else {
      toast.error(res.error ?? ADMIN_USER_MESSAGES.STATUS_UPDATE_FAILED);
    }
  };

  return (
    <div className="font-sans mt-5 px-2 container mx-auto min-h-screen bg-transparent text-foreground">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Seller Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage sellers, KYC verification, and platform access.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Sorted by join date (newest first).
        </p>
      </div>

      <div className="mb-4">
        <SearchInput
          placeholder="Search current page by name or email…"
          value={search}
          onChange={setSearch}
          debounceMs={500}
          className="max-w-md"
        />
        {search.trim() ? (
          <p className="text-xs text-muted-foreground mt-2">
            {filteredSellers.length} match
            {filteredSellers.length !== 1 ? 'es' : ''} on this page
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="limit" className="text-sm text-muted-foreground">
            Per page
          </Label>
          <Select value={String(limit)} onValueChange={handleLimitChange}>
            <SelectTrigger id="limit" className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LIMIT_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="pendingOnly"
            checked={pendingOnly}
            onCheckedChange={(v) => handlePendingOnlyChange(v === true)}
          />
          <Label
            htmlFor="pendingOnly"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Pending KYC only (submitted, not NOT_SUBMITTED)
          </Label>
        </div>
        <span className="text-sm text-muted-foreground">
          {totalSellers} seller{totalSellers !== 1 ? 's' : ''} total
        </span>
      </div>

      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <SellerTable
        sellers={filteredSellers}
        loading={isPending}
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) =>
          navigate({ page: nextPage, limit, pendingOnly })
        }
        totalSellers={totalSellers}
        onBlockSeller={handleBlockUser}
      />
    </div>
  );
}
