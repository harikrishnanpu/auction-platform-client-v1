import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KycSuccessModal({ isOpen, onClose }: SuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-8 relative transform transition-all scale-100 animate-in zoom-in-95 duration-300 border border-slate-100 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle size={32} strokeWidth={3} />
          </div>

          <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
            Submission Successful!
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
            Your KYC application has been securely submitted to our curation
            team. We will review your documents within 24-48 hours.
          </p>

          <div className="space-y-3 w-full">
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              View Status <ArrowRight size={16} />
            </button>
            <button
              onClick={() => router.push('/seller/landing')}
              className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium py-3 rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
