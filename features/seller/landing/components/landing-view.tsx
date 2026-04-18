'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { KycStatusEnum } from '@/types/kyc.type';
import { SiteFooter } from '@/components/layout/site-footer';

import { HeroSection } from './hero-section';
import { BenefitsSection } from './benefits-section';
import { SellerAgreement } from './seller-agreement';
import { FaqSection } from './faq-section';
import { SellerSidebar } from './seller-sidebar';

export function SellerLandingView({
  kycStatus,
}: {
  kycStatus: KycStatusEnum | null;
  error: string | null;
}) {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = () => {
    if (!acceptedTerms) {
      toast.error('Please accept the Seller Agreement to proceed');
      return;
    }
    router.push('/seller/kyc');
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-blue-50/50 dark:bg-slate-950 text-foreground flex flex-col">
      <main className="max-w-6xl mx-auto px-6 py-8 pb-20 animate-in fade-in duration-500 grow">
        <HeroSection />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <BenefitsSection />
            <SellerAgreement
              acceptedTerms={acceptedTerms}
              onAcceptTerms={setAcceptedTerms}
            />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <SellerSidebar
              kycStatus={kycStatus}
              acceptedTerms={acceptedTerms}
              onSubmit={handleSubmit}
            />
          </div>
        </div>

        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
