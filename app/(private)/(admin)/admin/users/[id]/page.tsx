'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Mail,
  MapPin,
  Phone,
  CheckCircle,
  ArrowLeft,
  Ban,
  ShieldAlert,
  X,
  Globe,
  KeyRound,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import {
  blockUserAction,
  getAdminUserAction,
} from '@/actions/admin/admin.actions';
import { toast } from 'sonner';
import {
  AuthProvider,
  UserInfo,
  UserRole,
  UserStatus,
} from '@/types/user.type';

const S3_BASE =
  'https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com';

function UserAvatar({ user }: { user: UserInfo }) {
  const src = user.avatar_url
    ? user.authProvider === AuthProvider.LOCAL
      ? `${S3_BASE}/${user.avatar_url}`
      : user.avatar_url
    : null;

  if (src) {
    return (
      <Image
        src={src}
        alt={user.name}
        width={64}
        height={64}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span className="text-xl font-bold text-gray-500 dark:text-gray-400">
      {user.name?.slice(0, 2).toUpperCase() ?? '?'}
    </span>
  );
}

function AuthBadge({ provider }: { provider: AuthProvider }) {
  const map = {
    [AuthProvider.GOOGLE]: {
      icon: <Globe size={12} />,
      label: 'Google',
      cls: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    },
    [AuthProvider.EMAIL]: {
      icon: <Mail size={12} />,
      label: 'Email',
      cls: 'bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400',
    },
    [AuthProvider.LOCAL]: {
      icon: <KeyRound size={12} />,
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
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
        <Ban size={11} />
        Blocked
      </span>
    );
  }
  if (status === UserStatus.PENDING) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
        <Clock size={11} />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
      <CheckCircle size={11} />
      Active
    </span>
  );
}

export default function AdminUserDetail() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmBlock, setConfirmBlock] = useState<{
    id: string;
    name: string;
    block: boolean;
  } | null>(null);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetchUser(params.id as string);
  }, [params.id]);

  const fetchUser = async (id: string) => {
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
  };

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
        toast.success(confirmBlock.block ? 'User blocked.' : 'User unblocked.');
      } else {
        toast.error(res.error ?? 'Failed to update user status.');
      }
    } catch {
      toast.error('Failed to update user status.');
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
            onClick={() => params.id && fetchUser(params.id as string)}
            className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
          >
            Retry
          </button>
          <button
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
              <UserAvatar user={user} />
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

          <button
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
            <StatusBadge status={user.status} />
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
            <AuthBadge provider={user.authProvider} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${confirmBlock.block ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}
              >
                <ShieldAlert size={24} />
              </div>
              <button
                onClick={() => setConfirmBlock(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {confirmBlock.block ? 'Block User?' : 'Unblock User?'}
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Are you sure you want to{' '}
              {confirmBlock.block ? 'block' : 'unblock'}{' '}
              <span className="font-bold text-foreground">
                {confirmBlock.name}
              </span>
              ?{confirmBlock.block && ' They will lose access to the platform.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBlock(null)}
                disabled={blocking}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockConfirm}
                disabled={blocking}
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors disabled:opacity-70 ${confirmBlock.block ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {blocking
                  ? 'Please wait…'
                  : confirmBlock.block
                    ? 'Confirm Block'
                    : 'Confirm Unblock'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
