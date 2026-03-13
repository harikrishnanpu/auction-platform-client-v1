'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DashboardHeader } from '@/components/layout/navbars/navbar';
import { SiteFooter } from '@/components/layout/site-footer';
import { PersonalInfo } from './personal-info';
import { DocumentUpload, UploadedFile } from './document-upload';
import { LivenessCheck } from './liveness-check';
import { KycStatus } from './kyc-status';

export function SellerKycView() {
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [livenessCompleted, setLivenessCompleted] = React.useState(false);

  const handleUploadSuccess = (file: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, file]);
  };

  const kycStatus = React.useMemo(() => {
    if (uploadedFiles.length === 3 && livenessCompleted) return 'PENDING';
    if (uploadedFiles.length > 0 || livenessCompleted) return 'INITIAL';
    return 'INITIAL';
  }, [uploadedFiles, livenessCompleted]);

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(135deg,var(--background)_0%,var(--muted)_100%)]" />

      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">
            Seller KYC Verification
          </h1>
          <p className="text-muted-foreground">
            Complete your identity verification to unlock selling privileges and
            list high-value luxury assets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area (Left) */}
          <div className="lg:col-span-8 space-y-6">
            <PersonalInfo />
            <DocumentUpload
              uploadedFiles={uploadedFiles}
              onUploadSuccess={handleUploadSuccess}
              kycType="SELLER"
            />
            <LivenessCheck
              isCompleted={livenessCompleted}
              onComplete={setLivenessCompleted}
            />
          </div>

          {/* Sidebar Status (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <KycStatus status={kycStatus} />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end gap-4 border-t border-border pt-6">
          <button className="px-6 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            Save Draft
          </button>
          <button className="bg-foreground text-background px-8 py-3 rounded-lg text-sm font-bold hover:bg-foreground/90 transition-all shadow-lg flex items-center gap-2">
            Submit for Approval <ArrowRight size={16} />
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
