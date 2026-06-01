'use client';

import { useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle,
  ArrowLeft,
  Ban,
  ShieldAlert,
} from 'lucide-react';
import {
  blockUserAction,
  getAdminUserAction,
} from '@/actions/admin/admin.actions';
import { ADMIN_USER_MESSAGES } from '@/constants/admin/messages.constants';
import { useAsyncEffect } from '@/hooks/use-async-effect';
import { toast } from 'sonner';
import { UserInfo, UserRole, UserStatus } from '@/types/user.type';
import useUserStore from '@/store/user.store';
import {
  UserAuthBadge,
  UserDetailAvatar,
  UserStatusBadge,
} from './user-detail-badges';
import { UserBlockConfirmDialog } from './user-block-confirm-dialog';

export function UserDetailView() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string | undefined;
  const currentUserId = useUserStore((s) => s.user?.id);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmBlock, setConfirmBlock] = useState<{
    id: string;
    name: string;
    block: boolean;
  } | null>(null);
  const [blocking, setBlocking] = useState(false);

  const fetchUser = useCallback(async (id: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAdminUserAction(id);
      if (!res.success) throw new Error(res.error);
      setUser(res.data);
    } catch {
      setError('Failed to load user details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useAsyncEffect(() => {
    if (!userId) return;
    void fetchUser(userId);
  }, [userId, fetchUser]);

  const handleBlockConfirm = async () => {
    if (!confirmBlock) return;
    setBlocking(true);
    try {
      const res = await blockUserAction(confirmBlock.id, confirmBlock.block);
      if (res.success) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                status: confirmBlock.block
                  ? UserStatus.BLOCKED
                  : UserStatus.ACTIVE,
              }
            : prev
        );
        toast.success(
          confirmBlock.block
            ? ADMIN_USER_MESSAGES.BLOCKED_SHORT
            : ADMIN_USER_MESSAGES.UNBLOCKED_SHORT
        );
      } else {
        toast.error(res.error ?? ADMIN_USER_MESSAGES.STATUS_UPDATE_FAILED);
      }
    } catch {
      toast.error(ADMIN_USER_MESSAGES.STATUS_UPDATE_FAILED);
    } finally {
      setBlocking(false);
      setConfirmBlock(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-t-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
          <ShieldAlert size={24} />
        </div>
        <p className="text-sm font-medium text-foreground">{error}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => userId && fetchUser(userId)}
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Go back
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isBlocked = user.status === UserStatus.BLOCKED;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="hover:text-foreground transition flex items-center gap-1"
          >
            <ArrowLeft size={14} /> Users
          </button>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">{user.name}</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-background shadow-sm flex items-center justify-center shrink-0">
              <UserDetailAvatar user={user} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {user.name}
                </h1>
                {user.isVerified && (
                  <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase border border-green-200 dark:border-green-800">
                    Verified
                  </span>
                )}
                {user.roles?.includes(UserRole.ADMIN) && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-bold uppercase border border-purple-200 dark:border-purple-800">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ID: {user.id}
              </p>
            </div>
          </div>

          {user.id !== currentUserId && (
            <button
              type="button"
              onClick={() =>
                setConfirmBlock({
                  id: user.id,
                  name: user.name,
                  block: !isBlocked,
                })
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
                isBlocked
                  ? 'border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/10'
                  : 'border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10'
              }`}
            >
              <Ban size={16} />
              {isBlocked ? 'Unblock User' : 'Block User'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Account Info
          </h2>

          <div className="flex items-start gap-3">
            <Mail size={16} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium text-foreground break-all">
                {user.email}
              </p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-start gap-3">
              <Phone
                size={16}
                className="text-muted-foreground mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">
                  {user.phone}
                </p>
              </div>
            </div>
          )}

          {user.address && (
            <div className="flex items-start gap-3">
              <MapPin
                size={16}
                className="text-muted-foreground mt-0.5 shrink-0"
              />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">
                  {user.address}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm space-y-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Status & Roles
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Account Status
            </span>
            <UserStatusBadge status={user.status} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Email Verified
            </span>
            {user.isVerified ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                <CheckCircle size={12} /> Yes
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">No</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Auth Provider</span>
            <UserAuthBadge provider={user.authProvider} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Profile Complete
            </span>
            <span className="text-xs font-medium text-foreground">
              {user.isProfileCompleted ? 'Yes' : 'No'}
            </span>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Roles</p>
            <div className="flex flex-wrap gap-1.5">
              {user.roles?.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {confirmBlock && (
        <UserBlockConfirmDialog
          name={confirmBlock.name}
          block={confirmBlock.block}
          blocking={blocking}
          onCancel={() => setConfirmBlock(null)}
          onConfirm={handleBlockConfirm}
        />
      )}
    </div>
  );
}
