import { AppDashboardShell } from '@/components/layout/app-dashboard-shell';
import { UserAssistantChat } from '@/components/assistant/user-assistant-chat';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen font-sans text-foreground transition-colors duration-300">
      <AppDashboardShell>{children}</AppDashboardShell>
      <UserAssistantChat />
    </div>
  );
}
