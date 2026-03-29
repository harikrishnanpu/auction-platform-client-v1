'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Settings,
  Shield,
  Bell,
  Gavel,
  Wallet,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import useUserStore from '@/store/user.store';
import { AvatarUpload } from '@/modules/user/profile/components/avatar-upload';
import { useProfileModalStore } from '@/store/profile-modal.store';
import { EditProfileModal } from '@/components/modals/edit-profile.modal';
import { ChangePasswordModal } from '@/components/modals/change-password.modal';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { editOpen, passwordOpen, closeEdit, closePassword } =
    useProfileModalStore();
  const storeUser = useUserStore((state) => state);
  const { user, setUser } = storeUser;

  if (!user) {
    return (
      <div className="flex justify-center items-center p-20 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const links = [
    { href: '/profile', label: 'My Profile', icon: User },
    { href: '/profile/settings', label: 'Account Settings', icon: Settings },
    { href: '/profile/security', label: 'Security', icon: Shield },
    { href: '/profile/notifications', label: 'Notifications', icon: Bell },
    { href: '/profile/my-auctions', label: 'My Auctions', icon: Gavel },
    { href: '/profile/wallet', label: 'Wallet', icon: Wallet },
    { href: '/profile/payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <Card className="p-4 sticky top-24 border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center">
              <div className="mb-2 relative">
                <AvatarUpload user={user} onUploadSuccess={setUser} />
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-bold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>

            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-sm',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5',
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </Card>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-in-out">
            {children}
          </div>
        </main>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={closeEdit}
        user={user}
        onSuccess={setUser}
      />
      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={closePassword}
        user={user}
      />
    </div>
  );
}
