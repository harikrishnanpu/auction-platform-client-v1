'use client';

import { useEffect, useRef } from 'react';
import useUserStore from '@/store/user.store';
import { IUser } from '@/types/user.type';

export default function UserProvider({
  user,
  children,
}: {
  user: IUser | null;
  children: React.ReactNode;
}) {
  const setUserStore = useUserStore((state) => state.setUser);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setUserStore(user);
    }
  }, [setUserStore, user]);

  return <>{children}</>;
}
