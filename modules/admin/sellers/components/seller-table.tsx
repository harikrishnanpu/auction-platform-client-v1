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
  KeyRound,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DataTable, Column } from '@/components/ui/data-table';
import { AuthProvider, UserRole, UserStatus } from '@/types/user.type';
import { KycProfile, KycStatusEnum } from '@/types/kyc.type';
import { SellerInfo } from '@/services/admin/admin.service';

const S3_BASE =
  'https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com';

const ROLE_COLORS: Record<string, string> = {
  ADMIN:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  SELLER:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  MODERATOR: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  USER: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

const KYC_COLORS: Record<KycStatusEnum, string> = {
  [KycStatusEnum.APPROVED]:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  [KycStatusEnum.SUBMITTED]:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  [KycStatusEnum.PENDING]:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  [KycStatusEnum.REJECTED]:
    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  [KycStatusEnum.NOT_SUBMITTED]:
    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

interface SellerTableProps {
  sellers: SellerInfo[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalSellers: number;
  onBlockSeller?: (id: string, block: boolean) => Promise<void>;
}

function SellerAvatar({ seller }: { seller: SellerInfo }) {
  const src = seller.avatar_url
    ? seller.authProvider === AuthProvider.LOCAL
      ? `${S3_BASE}/${seller.avatar_url}`
      : seller.avatar_url
    : null;

  if (src) {
    return (
      <div className="w-10 h-10 rounded-full ring-2 ring-background overflow-hidden shrink-0 relative">
        <Image
          src={src}
          alt={seller.name}
          fill
          sizes="40px"
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm ring-2 ring-background shrink-0">
      {seller.name?.charAt(0).toUpperCase() ?? '?'}
    </div>
  );
}

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
  if (status === UserStatus.BLOCKED)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <Ban size={11} /> Blocked
      </span>
    );
  if (status === UserStatus.PENDING)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
        <Clock size={11} /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
      <CheckCircle size={11} /> Active
    </span>
  );
}

function KycBadge({
  kyc,
  kycStatus,
}: {
  kyc?: KycProfile;
  kycStatus?: string;
}) {
  const status =
    (kycStatus as KycStatusEnum) ?? kyc?.status ?? KycStatusEnum.NOT_SUBMITTED;
  return (
    <span
      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${KYC_COLORS[status as KycStatusEnum] ?? KYC_COLORS[KycStatusEnum.NOT_SUBMITTED]}`}
    >
      {String(status).replace('_', ' ')}
    </span>
  );
}

export function SellerTable({
  sellers,
  loading,
  page,
  totalPages,
  onPageChange,
  totalSellers,
  onBlockSeller,
}: SellerTableProps) {
  const [confirmBlock, setConfirmBlock] = useState<{
    id: string;
    name: string;
    block: boolean;
  } | null>(null);

  const handleBlockConfirm = () => {
    if (confirmBlock && onBlockSeller) {
      onBlockSeller(confirmBlock.id, confirmBlock.block);
      setConfirmBlock(null);
    }
  };

  const columns: Column<SellerInfo>[] = [
    {
      header: 'Seller',
      cell: (seller) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <SellerAvatar seller={seller} />
          <div className="min-w-0">
            <div className="font-medium text-gray-900 dark:text-white truncate max-w-[160px]">
              {seller.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[160px]">
              {seller.email}
            </div>
            {seller.phone && (
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {seller.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Roles',
      cell: (seller) => (
        <div className="flex gap-1 flex-wrap">
          {seller.roles?.map((role: UserRole) => (
            <span
              key={role}
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                ROLE_COLORS[role] ?? ROLE_COLORS.USER
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: 'Auth',
      cell: (seller) => <AuthProviderBadge provider={seller.authProvider} />,
    },
    {
      header: 'KYC',
      cell: (seller) => (
        <KycBadge kyc={seller.kyc} kycStatus={seller.kycStatus} />
      ),
    },
    {
      header: 'Status',
      cell: (seller) => <StatusBadge status={seller.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (seller) => (
        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/sellers/${seller.id}`}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Seller"
          >
            <Eye size={18} />
          </Link>
          {onBlockSeller && (
            <button
              onClick={() =>
                setConfirmBlock({
                  id: seller.id,
                  name: seller.name,
                  block: seller.status !== UserStatus.BLOCKED,
                })
              }
              className={`p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                seller.status === UserStatus.BLOCKED
                  ? 'text-green-600 dark:text-green-400 hover:text-green-700'
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
              title={
                seller.status === UserStatus.BLOCKED
                  ? 'Unblock User'
                  : 'Block User'
              }
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
        data={sellers}
        columns={columns}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalSellers}
        onPageChange={onPageChange}
        emptyMessage="No sellers found."
      />

      {confirmBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Are you sure you want to{' '}
              {confirmBlock.block ? 'block' : 'unblock'}{' '}
              <span className="font-bold text-gray-900 dark:text-white">
                {confirmBlock.name}
              </span>
              ?
              {confirmBlock.block &&
                ' They will lose access to seller features.'}
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
                {confirmBlock.block ? 'Block User' : 'Unblock User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
