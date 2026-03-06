'use client';

import { useEffect, useRef } from 'react';
import useUserStore from '@/store/user.store';
import { UserInfo } from '@/types/user.type';

export default function UserProvider({
  user,
  children,
}: {
  user: UserInfo | null;
  children: React.ReactNode;
}) {
  const init = useRef(false);

  useEffect(() => {
    if (!init.current) {
      init.current = true;
      useUserStore.setState({ user });
    }
  }, [user]);

  return <>{children}</>;
}
