'use client';

import useUserStore from '@/store/user.store';
import { useProfileModalStore } from '@/store/profile-modal.store';
import { EditProfileModal } from '@/components/modals/edit-profile.modal';
import { ChangePasswordModal } from '@/components/modals/change-password.modal';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { editOpen, passwordOpen, closeEdit, closePassword } =
    useProfileModalStore();
  const { user, setUser } = useUserStore();

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="size-10 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-[13px] text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
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
    </>
  );
}
