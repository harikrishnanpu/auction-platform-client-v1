import React from 'react';
import { ThemeProvider } from './theme-provider';
import { SessionProvider } from '@/context/auth.context';
import { UserInfo } from '@/types/user.type';

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserInfo | null;
}) {
  return (
    <SessionProvider initialUser={initialUser}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
