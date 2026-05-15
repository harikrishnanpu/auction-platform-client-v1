import { DashboardHeader } from '@/components/layout/navbars/navbar';
import { UserAssistantChat } from '@/components/assistant/user-assistant-chat';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-app-shell min-h-screen font-sans text-foreground transition-colors duration-300">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
      <UserAssistantChat />
    </div>
  );
}
