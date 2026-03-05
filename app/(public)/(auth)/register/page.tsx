'use client';

import Link from 'next/link';
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

          <div className="relative">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-4xl shadow-2xl p-8 md:p-12 w-full relative overflow-hidden animate-slide-in-up">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Create Account
                </h2>

                <p className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                  <Link
                    className="text-primary font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
                    href="/login"
                  >
                    Log in
                  </Link>
                </p>
              </div>

              <RegisterForm />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
