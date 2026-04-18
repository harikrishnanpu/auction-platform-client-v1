import { ThemeProvider } from 'next-themes';
import React from 'react';
import UserProvider from './user-provider';
import { IUser } from '@/types/user.type';

export function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user: IUser | null;
}) {
  return (
    <UserProvider user={user}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </UserProvider>
  );
}
