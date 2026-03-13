'use client';

import { useEffect, useState, useCallback } from 'react';
import { UserStats } from './user-stats';
import { UserFilters, UserFilterState, DEFAULT_FILTERS } from './user-filters';
import { UserTable, User } from './user-table';
import {
  blockUserAction,
  getAllUsersAction,
} from '@/actions/admin/admin.actions';
import { IgetllUsersParams } from '@/types/admin.type';
import { UserStatus } from '@/types/user.type';
import { toast } from 'sonner';

export function UserManagementView() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserFilterState>(DEFAULT_FILTERS);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [stats] = useState<null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: IgetllUsersParams = {
        page,
        limit: filters.limit,
        search: filters.search,
        sort: filters.sort,
        order: filters.order,
        role: filters.role === 'all' ? 'ALL' : filters.role,
        status: filters.status === 'all' ? 'ALL' : filters.status,
        authProvider:
          filters.authProvider === 'all' ? 'ALL' : filters.authProvider,
      };

      const res = await getAllUsersAction(params);

      if (res.success) {
        setUsers(res.data?.users || []);
        setTotalPages(res.data?.totalPages || 1);
        setTotalUsers(res.data?.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFiltersChange = (newFilters: UserFilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const handleBlockUser = async (id: string, block: boolean) => {
    const res = await blockUserAction(id, block);

    if (res.success) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, status: block ? UserStatus.BLOCKED : UserStatus.ACTIVE }
            : u
        )
      );
      toast.success(
        block ? 'User blocked successfully' : 'User unblocked successfully'
      );
    } else {
      toast.error(res.error ?? 'Failed to update user');
    }
  };

  return (
    <div className="font-sans mt-5 px-2 container mx-auto min-h-screen bg-transparent text-foreground">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage users, roles, KYC verification, and platform access.
        </p>
      </div>

      <UserStats stats={stats} />

      <UserFilters
        filters={filters}
        onChange={handleFiltersChange}
        onReset={handleResetFilters}
        totalUsers={totalUsers}
      />

      <UserTable
        users={users}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        totalUsers={totalUsers}
        onBlockUser={handleBlockUser}
      />
    </div>
  );
}
