'use client';

import { authGetSesssion } from '@/actions/auth/auth.actions';
import { UserInfo } from '@/types/user.type';
import React, { createContext, useContext, useState, useCallback } from 'react';

interface SessionContextType {
  user: UserInfo | null;
  clearUser: () => void;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  clearUser: () => {},
  refreshSession: async () => {},
});

export const SessionProvider = ({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: UserInfo | null;
}) => {
  const [user, setUser] = useState<UserInfo | null>(initialUser);

  const refreshSession = useCallback(async () => {
    try {
      const response = await authGetSesssion();

      if (response && response.data) {
        setUser(response.data.user || null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('Failed to fetch session:', error);
      setUser(null);
    }
  }, []);

  const clearUser = () => {
    setUser(null);
  };

  const value: SessionContextType = {
    user,
    clearUser,
    refreshSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {' '}
      {children}{' '}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  return context;
};
