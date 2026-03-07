import Link from 'next/link';
import AuthNavbar from '@/components/layout/navbars/AuthNavbar';
import { ResetPasswordForm } from '@/modules/reset/password/components/reset-password-form';

export default function RecoverPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 bg-gradient-to-b from-blue-100 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <AuthNavbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-100/20 dark:bg-orange-900/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <ResetPasswordForm />
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-xs text-muted-foreground">
        <div>© 2024 Hammr.Down Inc.</div>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}
