import { Suspense } from 'react';
import { ChangePasswordForm } from '@/features/reset/password/components/change-password-form';
import AuthNavbar from '@/components/layout/navbars/AuthNavbar';

function ChangePasswordFallback() {
  return (
    <div className="min-h-80 flex items-center justify-center border-dashed">
      <div className="h-8 w-8 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white animate-spin" />
    </div>
  );
}

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300 font-sans">
      <AuthNavbar />

      <main className="min-h-screen flex items-center justify-center p-4 py-20 relative">
        <div
          className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-blue-100/50 to-transparent dark:from-blue-900/10 pointer-events-none"
          aria-hidden
        />
        <div className="absolute -top-24 right-1/4 w-72 h-72 bg-blue-400/15 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 w-full flex justify-center">
          <Suspense fallback={<ChangePasswordFallback />}>
            <ChangePasswordForm />
          </Suspense>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        © 2024 Hammr.Down Inc. All rights reserved.
      </footer>
    </div>
  );
}
