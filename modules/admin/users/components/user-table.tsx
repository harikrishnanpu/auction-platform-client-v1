'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Ban,
  Eye,
  X,
  ShieldAlert,
  Globe,
  Mail,
  KeyRound,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DataTable, Column } from '@/components/ui/data-table';
import { AuthProvider, UserRole, UserStatus } from '@/types/user.type';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  roles: UserRole[];
  isVerified: boolean;
  isProfileCompleted: boolean;
  status: UserStatus;
  authProvider: AuthProvider;
}

interface UserTableProps {
  users: User[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalUsers: number;
  onBlockUser?: (id: string, block: boolean) => Promise<void>;
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  SELLER:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  MODERATOR: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  USER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

function AuthProviderBadge({ provider }: { provider: AuthProvider }) {
  const map: Record<
    AuthProvider,
    { icon: React.ReactNode; label: string; cls: string }
  > = {
    [AuthProvider.GOOGLE]: {
      icon: <Globe size={11} />,
      label: 'Google',
      cls: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    },
    [AuthProvider.EMAIL]: {
      icon: <Mail size={11} />,
      label: 'Email',
      cls: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400',
    },
    [AuthProvider.LOCAL]: {
      icon: <KeyRound size={11} />,
      label: 'Password',
      cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
  };
  const { icon, label, cls } = map[provider] ?? map[AuthProvider.LOCAL];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {icon}
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  if (status === UserStatus.BLOCKED) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <Ban size={11} />
        Blocked
      </span>
    );
  }
  if (status === UserStatus.PENDING) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
        <Clock size={11} />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
      <CheckCircle size={11} />
      Active
    </span>
  );
}

function UserAvatar({ user }: { user: User }) {
  if (user.avatar_url) {
    return (
      <div className="w-10 h-10 rounded-full ring-2 ring-background overflow-hidden shrink-0 relative">
        <Image
          src={user.avatar_url}
          alt={user.name}
          fill
          sizes="40px"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm ring-2 ring-background shrink-0">
      {user.name?.charAt(0).toUpperCase() ?? '?'}
    </div>
  );
}

export function UserTable({
  users,
  loading,
  page,
  totalPages,
  onPageChange,
  totalUsers,
  onBlockUser,
}: UserTableProps) {
  const [confirmBlock, setConfirmBlock] = useState<{
    id: string;
    name: string;
    block: boolean;
  } | null>(null);

  const handleBlockConfirm = () => {
    if (confirmBlock && onBlockUser) {
      onBlockUser(confirmBlock.id, confirmBlock.block);
      setConfirmBlock(null);
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'User',
      cell: (user) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <UserAvatar user={user} />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {user.email}
            </div>
            {user.phone && (
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {user.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Roles',
      cell: (user) => (
        <div className="flex gap-1 flex-wrap">
          {user.roles.map((role) => (
            <span
              key={role}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[role] ?? ROLE_COLORS.USER}`}
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Auth',
      cell: (user) => <AuthProviderBadge provider={user.authProvider} />,
    },
    {
      header: 'Verified',
      cell: (user) =>
        user.isVerified ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle size={11} />
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock size={11} />
            Pending
          </span>
        ),
    },
    {
      header: 'Status',
      cell: (user) => <StatusBadge status={user.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (user) => (
        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/users/${user.id}`}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Profile"
          >
            <Eye size={18} />
          </Link>
          {onBlockUser && (
            <button
              onClick={() =>
                setConfirmBlock({
                  id: user.id,
                  name: user.name,
                  block: user.status !== UserStatus.BLOCKED,
                })
              }
              className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                user.status === UserStatus.BLOCKED
                  ? 'text-green-600 dark:text-green-400 hover:text-green-700'
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              title={user.status === UserStatus.BLOCKED ? 'Unblock' : 'Block'}
            >
              <Ban size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalUsers}
        onPageChange={onPageChange}
        emptyMessage="No users found."
      />

      {/* Block / Unblock Confirm Modal */}
      {confirmBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <ShieldAlert size={24} />
              </div>
              <button
                onClick={() => setConfirmBlock(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {confirmBlock.block ? 'Block User?' : 'Unblock User?'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to{' '}
              {confirmBlock.block ? 'block' : 'unblock'}{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {confirmBlock.name}
              </span>
              ?
              {confirmBlock.block &&
                ' They will no longer be able to access the platform.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBlock(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors shadow-lg ${
                  confirmBlock.block
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                    : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                }`}
              >
                {confirmBlock.block ? 'Confirm Block' : 'Confirm Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
