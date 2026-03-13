import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { redirect } from 'next/navigation';
import './globals.css';
import { Providers } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import { authGetSesssion } from '@/actions/auth/auth.actions';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hammer | Auction Platform',
  description: 'Auction Platform Project by Hari Krishnan P U',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await authGetSesssion();
  if (user.success === false && user.error === 'ACCOUNT_BLOCKED') {
    redirect('/login?error=blocked');
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers user={user.data || null}>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
