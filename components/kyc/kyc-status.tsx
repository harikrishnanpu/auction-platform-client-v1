import { Loader, CheckCircle, CircleDot, Circle, Headset } from 'lucide-react';

interface KycStatusProps {
  status?: string;
}

export function KycStatus({ status = 'INITIAL' }: KycStatusProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-border">
        <h3 className="text-lg font-bold font-sans mb-4 text-foreground">
          KYC Status
        </h3>
        <div className="text-center py-6">
          <div
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-3 ${
              status === 'VERIFIED'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-600'
                : status === 'REJECTED'
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600'
                  : status === 'PENDING'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
            }`}
          >
            {status === 'VERIFIED' ? (
              <CheckCircle size={32} />
            ) : status === 'REJECTED' ? (
              <CircleDot size={32} />
            ) : status === 'PENDING' ? (
              <Loader className="animate-spin" size={32} />
            ) : (
              <Circle size={32} />
            )}
          </div>
          <h4 className="text-xl font-bold text-foreground">
            {status === 'VERIFIED'
              ? 'Verified'
              : status === 'REJECTED'
                ? 'Application Rejected'
                : status === 'PENDING'
                  ? 'In Review'
                  : 'Application Started'}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {status === 'PENDING'
              ? 'Est. completion: 24 Hours'
              : status === 'VERIFIED'
                ? 'You are approved to sell!'
                : status === 'REJECTED'
                  ? 'Please check your email for details.'
                  : 'Complete tasks to submit'}
          </p>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 mb-2 mt-2">
          <div
            className={`h-2.5 rounded-full ${
              status === 'VERIFIED'
                ? 'bg-green-500 w-full'
                : status === 'REJECTED'
                  ? 'bg-red-500 w-full'
                  : status === 'PENDING'
                    ? 'bg-yellow-500 w-[65%]'
                    : 'bg-blue-500 w-[10%]'
            }`}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span className={status !== 'INITIAL' ? 'text-primary' : ''}>
            Submitted
          </span>
          <span
            className={
              status === 'PENDING' ||
              status === 'VERIFIED' ||
              status === 'REJECTED'
                ? 'text-primary'
                : ''
            }
          >
            Review
          </span>
          <span className={status === 'VERIFIED' ? 'text-green-600' : ''}>
            Approved
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-border">
        <h3 className="text-lg font-bold font-sans mb-4 text-foreground">
          Compliance Checklist
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-green-500">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Email Verification
              </p>
              <p className="text-xs text-muted-foreground">
                Completed on Oct 12, 2023
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-green-500">
              <CheckCircle size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Phone Verification
              </p>
              <p className="text-xs text-muted-foreground">
                Completed on Oct 12, 2023
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-500 animate-pulse">
              <CircleDot size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Document Verification
              </p>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </div>
          </div>
          <div className="flex items-start gap-3 opacity-50">
            <div className="mt-0.5 text-gray-400">
              <Circle size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Background Check
              </p>
              <p className="text-xs text-muted-foreground">
                Waiting for documents
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Headset size={20} />
          </div>
        </div>
        <h3 className="text-lg font-bold mb-2">Need Assistance?</h3>
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          {
            "If you're having trouble uploading documents, our compliance team is available 24/7."
          }
        </p>
        <button className="w-full bg-white text-slate-900 text-sm font-bold py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
