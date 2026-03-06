'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  useEffect(() => {
    if (success === 'true') {
      toast.success('Successfully logged in with Google');
      // Force a hard refresh to ensure server-side auth state (cookies) is picked up by RootLayout
      window.location.href = '/home';
    } else if (error) {
      toast.error(error);
      router.push('/login');
    } else {
      // Fallback if no params
      router.push('/login');
    }
  }, [success, error, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Processing login...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
