'use client';

import Link from 'next/link';
import {
  Crown,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Shield,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { InfoGroup } from '@/components/info-group/InfoGroup';
import useUserStore from '@/store/user.store';
import { useProfileModalStore } from '@/store/profile-modal.store';

import { AvatarUpload } from './avatar-upload';
import { ProfilePageCard, ProfilePageShell } from './profile-page-shell';

export function ProfileView() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const { openEdit, openPassword } = useProfileModalStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="size-9 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProfilePageShell>
      <ProfilePageCard className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-brand-50 via-sky-50/80 to-card px-5 py-6 dark:from-brand-950/40 dark:via-slate-900/50 dark:to-card sm:px-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <AvatarUpload user={user} onUploadSuccess={setUser} size="lg" />
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-lg font-bold text-foreground sm:text-xl">
                {user.name}
              </h2>
              <p className="text-[13px] text-muted-foreground">{user.email}</p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="shrink-0 rounded-full"
              onClick={openEdit}
            >
              <Pencil className="size-3.5" />
              Edit profile
            </Button>
          </div>
        </div>
      </ProfilePageCard>

      <ProfilePageCard title="Personal information" icon={Shield}>
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoGroup
            icon={<Mail className="size-3.5" />}
            label="Email address"
            value={user.email}
          />
          <InfoGroup
            icon={<Phone className="size-3.5" />}
            label="Phone number"
            value={user.phone || 'Not provided'}
          />
          <InfoGroup
            icon={<MapPin className="size-3.5" />}
            label="Shipping address"
            value={user.address || 'Not provided'}
            fullWidth
          />
          <InfoGroup
            icon={<Crown className="size-3.5" />}
            label="Subscription"
            value={
              user.subscription
                ? `${user.subscription.planName} (${user.subscription.status})`
                : 'No active plan'
            }
            fullWidth
          />
        </div>
      </ProfilePageCard>

      <ProfilePageCard title="Account & security" icon={KeyRound}>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button type="button" className="rounded-full" onClick={openEdit}>
            Edit profile
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={openPassword}
          >
            Change password
          </Button>
          <Link href="/profile/subscription" className="inline-block">
            <Button variant="outline" className="rounded-full">
              <Crown className="size-3.5" />
              Manage subscription
            </Button>
          </Link>
          <Link href="/profile/wallet" className="inline-block">
            <Button variant="outline" className="rounded-full">
              <Wallet className="size-3.5" />
              Open wallet
            </Button>
          </Link>
        </div>
      </ProfilePageCard>
    </ProfilePageShell>
  );
}
