'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { UserStats } from './user-stats';
import { UserFilters, UserFilterState, DEFAULT_FILTERS } from './user-filters';
import { UserTable } from './user-table';
import { blockUserAction } from '@/actions/admin/admin.actions';
import { ADMIN_USER_MESSAGES } from '@/constants/admin/messages.constants';
import { buildAdminUserSearchParams } from '@/lib/admin-search-params';
import { toast } from 'sonner';
import useUserStore from '@/store/user.store';
import { IUser } from '@/types/user.type';

type UserManagementViewProps = {
  filters: UserFilterState;
  page: number;
  users: IUser[];
  totalPages: number;
  totalUsers: number;
  error: string | null;
};

export function UserManagementView({
  filters,
  page,
  users,
  totalPages,
  totalUsers,
  error,
}: UserManagementViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentUserId = useUserStore((s) => s.user?.id);
  const [stats] = useState<null>(null);

  function navigate(nextFilters: UserFilterState, nextPage: number) {
    const query = buildAdminUserSearchParams(nextFilters, nextPage);
    startTransition(() => {
      router.push(query ? `/admin/users?${query}` : '/admin/users');
    });
  }

  const handleFiltersChange = (newFilters: UserFilterState) => {
    navigate(newFilters, 1);
  };

  const handleResetFilters = () => {
    navigate(DEFAULT_FILTERS, 1);
  };

  const handleBlockUser = async (id: string, block: boolean) => {
    const res = await blockUserAction(id, block);

    if (res.success) {
      toast.success(
        block ? ADMIN_USER_MESSAGES.BLOCKED : ADMIN_USER_MESSAGES.UNBLOCKED
      );
      router.refresh();
    } else {
      toast.error(res.error ?? ADMIN_USER_MESSAGES.UPDATE_FAILED);
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

      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <UserTable
        users={users}
        loading={isPending}
        page={page}
        totalPages={totalPages}
        onPageChange={(nextPage) => navigate(filters, nextPage)}
        totalUsers={totalUsers}
        onBlockUser={handleBlockUser}
        currentUserId={currentUserId}
      />
    </div>
  );
}
