import LandingNavbar from '@/components/layout/navbars/LandingNavbar';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { SolutionSection } from '@/features/landing/components/SolutionSection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { CTASection } from '@/features/landing/components/CTASection';
import { WhyUsSection } from '@/features/landing/components/WhyUsSection';
import { LandingFooter } from '@/components/layout/footers/landingFooter';

export default function LandingPage() {
  return (
    <div>
      <div className="min-h-screen bg-linear-to-b from-blue-200 via-gray-50 to-orange-50 dark:from-blue-900 dark:via-gray-900 dark:to-purple-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        {/* Navigation */}
        <LandingNavbar />

        {/* Main Content */}
        <main className="container mx-auto px-4 md:px-8 pb-20">
          {/* Hero Section */}
          <HeroSection />

          {/* Solutions Section */}
          <SolutionSection />

          {/* Features Section */}
          <FeaturesSection />

          {/* Why Us Section */}
          <WhyUsSection />

          {/* CTA Section */}
          <CTASection />
        </main>

        {/* Footer */}
        <LandingFooter />
      </div>
    </div>
  );
}
