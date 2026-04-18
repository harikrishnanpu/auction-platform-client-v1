'use client';

import { RegisterForm } from '@/features/auth/components/register/register-form';
import TestimonialCard from '@/components/marketing/TestimonialCard';
import AuthNavbar from '@/components/layout/navbars/AuthNavbar';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
      <AuthNavbar />

      <main className="min-h-screen flex items-center justify-center p-4 py-20 relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-blue-100/50 to-transparent dark:from-blue-900/10 pointer-events-none"></div>
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
          <TestimonialCard />

          <div className="relative animate-slide-in-up">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <RegisterForm />
          </div>
        </div>
      </main>
    </div>
  );
}
