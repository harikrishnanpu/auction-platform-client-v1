'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { SellerTable } from './seller-table';
import {
  blockUserAction,
  getAllSellersAction,
} from '@/actions/admin/admin.actions';
import { SellerInfo } from '@/services/admin/admin.service';
import { IgetllSellersParams } from '@/types/admin.type';
import { UserStatus } from '@/types/user.type';
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

export function SellerManagementView() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [pendingOnly, setPendingOnly] = useState(false);
  const [sellers, setSellers] = useState<SellerInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSellers, setTotalSellers] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: IgetllSellersParams = {
        page,
        limit,
        ...(pendingOnly && { pendingOnly: true }),
      };

      const res = await getAllSellersAction(params);

      if (res.success && res.data) {
        setSellers(res.data.sellers ?? []);
        setTotalPages(res.data.totalPages ?? 1);
        setTotalSellers(res.data.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, pendingOnly]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredSellers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sellers;
    return sellers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [sellers, search]);

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  const handlePendingOnlyChange = (checked: boolean) => {
    setPendingOnly(checked);
    setPage(1);
  };

  const handleBlockUser = async (id: string, block: boolean) => {
    const res = await blockUserAction(id, block);

    if (res.success) {
      setSellers((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: block ? UserStatus.BLOCKED : UserStatus.ACTIVE }
            : s
        )
      );
      toast.success(
        block ? 'User blocked successfully' : 'User unblocked successfully'
      );
    } else {
      toast.error(res.error ?? 'Failed to update user status');
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

      <SellerTable
        sellers={filteredSellers}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalSellers={totalSellers}
        onBlockSeller={handleBlockUser}
      />
    </div>
  );
}
