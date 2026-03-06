import LandingNavbar from '@/components/layout/navbars/LandingNavbar';
import { HeroSection } from '@/modules/landing/components/HeroSection';
import { SolutionSection } from '@/modules/landing/components/SolutionSection';
import { FeaturesSection } from '@/modules/landing/components/FeaturesSection';
import { CTASection } from '@/modules/landing/components/CTASection';
import { WhyUsSection } from '@/modules/landing/components/WhyUsSection';
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
