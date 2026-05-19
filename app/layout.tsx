import type { Metadata } from 'next';
import { Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { redirect } from 'next/navigation';
import './globals.css';
import { Providers } from '@/providers';
import { Toaster } from '@/components/ui/sonner';
import { authGetSesssion, logoutAction } from '@/actions/auth/auth.actions';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hammer Down | Auction Platform',
  description: 'Auction Platform Project by Hari Krishnan P U',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await authGetSesssion();

  if (
    user.success === false &&
    (user.error === 'ACCOUNT_BLOCKED' || user.error === 'ACCOUNT_SUSPENDED')
  ) {
    await logoutAction();
    const q = user.error === 'ACCOUNT_SUSPENDED' ? 'suspended' : 'blocked';
    redirect(`/login?error=${q}`);
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Providers user={user.data || null}>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
