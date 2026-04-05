import AuthNavbar from '@/components/layout/navbars/AuthNavbar';
import { CompleteProfileForm } from '@/features/complete-profile/components/complete-profile-form';

export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <AuthNavbar />

      <main className="min-h-screen flex items-center justify-center p-4 py-20 relative">
        <CompleteProfileForm />
      </main>

      <footer className="py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        © 2024 Hammr.Down Inc. All rights reserved.
      </footer>
    </div>
  );
}
