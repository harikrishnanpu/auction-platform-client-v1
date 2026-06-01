'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SELLER_LANDING_MESSAGES } from '@/constants/seller/landing.constants';
import { KycStatusEnum } from '@/types/kyc.type';
import { SiteFooter } from '@/components/layout/footers/site-footer';

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
      toast.error(SELLER_LANDING_MESSAGES.AGREEMENT_REQUIRED);
      return;
    }
    router.push('/seller/kyc');
  };

  return (
    <div className="flex min-h-screen flex-col bg-transparent font-sans text-foreground transition-colors duration-300">
      <main className="mx-auto max-w-[1200px] grow px-4 py-8 pb-20 animate-in fade-in duration-500 sm:px-6">
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
