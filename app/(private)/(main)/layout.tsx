import { LandingFooter } from '@/components/layout/footers/landingFooter';
import { DashboardHeader } from '@/components/layout/navbars/navbar';
import { UserAssistantChat } from '@/components/assistant/user-assistant-chat';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-linear-to-b from-blue-200 via-blue-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
      <UserAssistantChat />
    </div>
  );
}
