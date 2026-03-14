import { ThemeProvider } from 'next-themes';
import React from 'react';
import UserProvider from './user-provider';
import { QueryProvider } from './query-provider';
import { UserInfo } from '@/types/user.type';

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserInfo | null;
}) {
  return (
    <QueryProvider>
      <UserProvider user={user}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </UserProvider>
    </QueryProvider>
  );
}
