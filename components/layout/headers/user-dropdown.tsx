'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import useUserStore from '@/store/user.store';
import { AuthProvider } from '@/types/user.type';
import { getUserAvatarUrl } from '@/utils/auction-utils';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const userFirstName = user.name?.split(' ')[0] ?? 'Account';
  const userInitials = user.name ? user.name.slice(0, 2).toUpperCase() : 'HD';

  const avatarNode = user.avatar_url ? (
    user.authProvider === AuthProvider.LOCAL ? (
      <Image
        data-testid="user-avatar"
        src={getUserAvatarUrl(user.avatar_url)}
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    ) : (
      <Image
        data-testid="user-avatar"
        src={user.avatar_url}
        alt=""
        width={36}
        height={36}
        className="size-full object-cover"
      />
    )
  ) : (
    userInitials
  );

  return (
    <div className="relative" ref={ref}>
      <button
        data-testid="user-dropdown-button"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card py-1 pr-1.5 pl-1 shadow-sm"
        aria-label="User menu"
      >
        <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
          {avatarNode}
        </div>
        <span className="max-w-[72px] truncate text-[13px] font-semibold sm:max-w-[100px]">
          {userFirstName}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-xl">
          <Link
            data-testid="profile-settings-link"
            href="/profile"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-muted text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Profile settings
          </Link>
          <Link
            data-testid="utility-actions-wallet-link"
            href="/profile/wallet"
            className="block rounded-xl px-3 py-2 text-sm hover:bg-muted text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Wallet
          </Link>
        </div>
      )}
    </div>
  );
}
