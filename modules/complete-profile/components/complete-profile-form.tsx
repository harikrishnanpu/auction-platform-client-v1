'use client';

import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCompleteProfile } from '../hooks/useCompleteProfile';
import { logoutAction } from '@/actions/auth/auth.actions';

export function CompleteProfileForm() {
  const { form, isSubmitting, onSubmit } = useCompleteProfile();
  const {
    register,
    formState: { errors },
  } = form;
  const router = useRouter();

  return (
    <div className="w-full max-w-md bg-[#F0F6FA]/80 backdrop-blur-xl border dark:bg-blue-500/10 rounded-[2rem] shadow-xl p-8 md:p-10 relative overflow-hidden fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          Almost There
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please provide your contact details to complete your profile.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1"
          >
            Phone Number
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors w-5 h-5" />
            </div>
            <input
              id="phone"
              placeholder="+1 234 567 890"
              className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none"
              disabled={isSubmitting}
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="address"
            className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1"
          >
            Address
          </label>
          <div className="relative group">
            <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none">
              <MapPin className="text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors w-5 h-5" />
            </div>
            <textarea
              id="address"
              placeholder="Enter your full address"
              className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all outline-none resize-none min-h-[120px]"
              disabled={isSubmitting}
              {...register('address')}
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1 ml-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {errors.root && (
          <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 p-3 rounded-xl mb-4 font-medium animate-in fade-in slide-in-from-top-2">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black"></span>
          ) : (
            <>
              <span>Complete Profile</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="mt-8 text-center pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Want to use a different account?{' '}
            <button
              type="button"
              onClick={async () => {
                await logoutAction();
                router.replace('/login');
              }}
              className="font-bold text-black dark:text-white hover:underline transition-all"
            >
              Sign Out
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
