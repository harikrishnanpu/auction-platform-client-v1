'use client';

import { Column, DataTable } from '@/components/ui/data-table';
import { ISuspendedUserItem } from '@/types/fraud-report.type';

export function SuspendedUsersTable({
  users,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
  onOpenTimeline,
}: {
  users: ISuspendedUserItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  onOpenTimeline: (userId: string) => void;
}) {
  const columns: Column<ISuspendedUserItem>[] = [
    { header: 'User', accessorKey: 'userName' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Suspension', accessorKey: 'activeSuspensionType' },
    {
      header: 'Ends At',
      cell: (item) =>
        item.activeSuspensionEndsAt
          ? new Date(item.activeSuspensionEndsAt).toLocaleString()
          : 'Permanent',
    },
    {
      header: 'Timeline',
      className: 'text-right',
      cell: (item) => (
        <div className="text-right">
          <button
            onClick={() => onOpenTimeline(item.userId)}
            className="rounded-md border px-2 py-1 text-xs"
          >
            View timeline
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={users.map((u) => ({ ...u, id: u.userId }))}
      columns={columns as Column<ISuspendedUserItem & { id: string }>[]}
      loading={loading}
      page={page}
      totalPages={totalPages}
      totalItems={total}
      onPageChange={onPageChange}
      emptyMessage="No suspended users found."
    />
  );
}
