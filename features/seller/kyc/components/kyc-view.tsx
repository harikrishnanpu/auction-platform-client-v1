'use client';

import {
  ArrowRight,
  CheckCircle,
  ShieldAlert,
  Loader2 as LoaderIcon,
} from 'lucide-react';
import { SiteFooter } from '@/components/layout/site-footer';
import { PersonalInfo } from '@/components/kyc/personal-info';
import { DocumentUpload } from '@/components/kyc/document-upload';
import { LivenessCheck } from '@/components/kyc/liveness-check';
import { KycStatus } from '@/components/kyc/kyc-status';
import { KycSuccessModal } from '@/components/kyc/kyc-success-modal';

import { useSellerKyc } from '@/features/seller/kyc/hooks/use-seller-kyc';

export function SellerKycView() {
  const {
    status,
    loading,
    uploadedFiles,
    livenessCompleted,
    validationErrors,
    showSuccessModal,
    rejectReason,
    handleUploadSuccess,
    handleRemoveDocument,
    setLivenessCompleted,
    handleSubmit,
    handleModalClose,
    returnToDashboard,
  } = useSellerKyc();

  if (status === 'loading') {
    return (
      <div className="min-h-screen font-sans bg-background text-foreground flex items-center justify-center">
        <LoaderIcon className="animate-spin text-muted-foreground" size={32} />
      </div>
    );
  }

  if (status === 'PENDING' || status === 'VERIFIED') {
    return (
      <div className="min-h-screen font-sans transition-colors duration-300 bg-background text-foreground">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              KYC Application Status
            </h1>
            <p className="text-muted-foreground">
              Here is the current status of your application.
            </p>
          </div>
          <KycStatus status={status} />
          {status === 'PENDING' && (
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Your documents are under review. We will notify you once a
              decision is made.
            </p>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={returnToDashboard}
              className="text-primary hover:underline"
            >
              Return to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-background text-foreground">
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(135deg,var(--background)_0%,var(--muted)_100%)]" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 ">
            Seller KYC Verification
          </h1>
          <p className="text-muted-foreground">
            Complete your identity verification to unlock selling privileges and
            list high-value luxury assets.
          </p>
          {status === 'REJECTED' && (
            <div className="mt-4 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
              <p>
                Your previous submission was rejected. Please review and
                resubmit your documents.
              </p>
              {rejectReason && (
                <p className="mt-2 font-medium">Reason: {rejectReason}</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <PersonalInfo />
            <DocumentUpload
              uploadedFiles={uploadedFiles}
              onUploadSuccess={handleUploadSuccess}
              onRemoveDocument={handleRemoveDocument}
              kycType="SELLER"
            />
            <LivenessCheck
              isCompleted={livenessCompleted}
              onComplete={setLivenessCompleted}
            />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <KycStatus status={status} />
          </div>
        </div>
        <div className="mt-12 flex flex-col md:flex-row md:items-start justify-between gap-8 border-t border-border pt-8 pb-12">
          <div className="flex-1 min-h-[80px]">
            {validationErrors.length > 0 && (
              <div className="w-full max-w-2xl bg-red-50 dark:bg-red-100/10 border border-red-200 dark:border-red-500/30 p-5 rounded-2xl animate-in fade-in slide-in-from-left-2">
                <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 mb-3">
                  <ShieldAlert size={18} className="shrink-0" />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    Verification Requirements Missing
                  </span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {validationErrors.map((err, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-red-500/80 flex items-center gap-2.5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-4 shrink-0">
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl border border-border">
                <CheckCircle size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Secure Verification
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black hover:bg-[#333333] dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium py-3.5 px-10 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin dark:border-black/30 dark:border-t-black"></span>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mr-2">
              Final submission for seller privileges.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
      <KycSuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />
    </div>
  );
}
