import AuthNavbar from '@/components/layout/navbars/AuthNavbar';
import { VerifyEmailForm } from '@/features/verify/email/components/verify-email-form';

export default function VerifyEmailPage() {
  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800`}
    >
      <AuthNavbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-100/50 to-transparent dark:from-blue-900/10 pointer-events-none"></div>
        <VerifyEmailForm />
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
        <div>© 2024 Hammr.Down Inc.</div>
        <div className="flex gap-4">
          <a
            href="#"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
