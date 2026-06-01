import { Ban, CheckCircle, Clock, Globe, KeyRound, Mail } from 'lucide-react';
import Image from 'next/image';
import { AuthProvider, UserInfo, UserStatus } from '@/types/user.type';

const S3_BASE =
  'https://hammer-down-auction-platform.s3.ap-south-1.amazonaws.com';

export function UserDetailAvatar({ user }: { user: UserInfo }) {
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

export function UserAuthBadge({ provider }: { provider: AuthProvider }) {
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

export function UserStatusBadge({ status }: { status: UserStatus }) {
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
