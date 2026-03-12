'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
  Gem,
  Globe,
  ShieldCheck,
  CreditCard,
  Truck,
  Check,
  ArrowRight,
  Info,
  Package,
  FileText,
  IndianRupee,
} from 'lucide-react';
import { SiteFooter } from '@/components/layout/site-footer';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SellerLandingView() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const { status, error } = { status: 'VERIFIED', error: null };

  const renderStatusBadge = () => {
    if (status === 'VERIFIED') {
      return (
        <span className="text-xs font-bold text-green-600 dark:text-green-400">
          Verified
        </span>
      );
    }

    if (status === 'PENDING') {
      return (
        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
          Pending
        </span>
      );
    }

    if (status === 'REJECTED') {
      return (
        <span className="text-xs font-bold text-red-600 dark:text-red-400">
          Rejected
        </span>
      );
    }

    return (
      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
        Not Submitted
      </span>
    );
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 bg-blue-50/50 dark:bg-slate-950 text-foreground flex flex-col">
      <main className="max-w-6xl mx-auto px-6 py-8 pb-20 animate-in fade-in duration-500 grow">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => router.refresh()}
              className="text-xs font-bold uppercase tracking-wider hover:underline"
            >
              Retry
            </button>
          </div>
        )}
        {/* Header Section */}
        <div className="relative mb-12 text-center max-w-2xl mx-auto">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-200/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10"></div>
          <span className="inline-block py-1 px-3 rounded-full bg-background border border-border text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm text-muted-foreground">
            Start Selling
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground">
            Turn Assets into Legacy.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Join the elite circle of sellers on HammerDown. High-value auctions,
            verified buyers, and seamless white-glove transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Benefits Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3   text-foreground">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <Gem size={16} />
                </span>
                Why Sell with Us?
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <Globe className="text-foreground mb-3" size={24} />
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Global Exposure
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Instantly reach qualified collectors and investors in over
                    50 countries.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <ShieldCheck className="text-foreground mb-3" size={24} />
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Authentication First
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our team verifies every item, building instant trust with
                    potential buyers.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <CreditCard className="text-foreground mb-3" size={24} />
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    Secured Payouts
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Funds are held in escrow and released immediately upon
                    verified delivery.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <Truck className="text-foreground mb-3" size={24} />
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    White-Glove Logistics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We handle fully insured shipping, customs, and delivery
                    coordination.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms & Agreement */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-semibold mb-6   text-foreground">
                Seller Agreement
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-6 h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border">
                <p>
                  By applying to become a seller on HammerDown, you agree to our
                  strict quality and authenticity standards. We maintain a
                  zero-tolerance policy for counterfeits.
                </p>
                <p>
                  <strong>1. Authenticity Guarantee:</strong> You certify that
                  all items listed are 100% authentic. Any item found to be
                  counterfeit will result in an immediate permanent ban and
                  potential legal action.
                </p>
                <p>
                  <strong>2. Listing Accuracy:</strong> You agree to represent
                  the condition of your items accurately, disclosing all flaws,
                  modifications, or repairs.
                </p>
                <p>
                  <strong>3. Shipping Timelines:</strong> Items must be shipped
                  to our authentication hub within 48 hours of a successful
                  sale.
                </p>
                <p>
                  <strong>4. Fee Structure:</strong> A standard commission fee
                  of 10% is applied to the final hammer price. Payment
                  processing fees may apply.
                </p>
                <p>
                  <strong>5. Exclusivity:</strong> Items listed on HammerDown
                  cannot be listed on other marketplaces simultaneously.
                </p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-input bg-background checked:bg-foreground checked:border-foreground transition-all"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span className="absolute text-background opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <Check size={14} strokeWidth={3} />
                  </span>
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none pt-0.5">
                  I have read and agree to the Seller Terms of Service and
                  Commission Structure.
                </span>
              </label>
            </div>
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-border sticky top-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
                  <span className="text-xl font-bold text-muted-foreground">
                    HS
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground  ">
                    Hari S.
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Member since 2021
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-md w-fit">
                    <ShieldCheck size={12} /> Verified ID
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Seller Status
                </p>
                {renderStatusBadge()}
              </div>

              {/* Eligibility Meter */}
              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Seller Eligibility
                    </p>
                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                      Excellent
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-3xl font-bold text-foreground">
                      98
                      <span className="text-lg text-muted-foreground font-normal">
                        /100
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: '98%' }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your high trust score qualifies you for Tier 1 selling
                    privileges.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {status === 'VERIFIED' ? (
                  <div className="w-full bg-green-600 text-white py-3.5 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
                    <ShieldCheck size={18} /> Verified Seller
                  </div>
                ) : status === 'PENDING' ? (
                  <Link
                    href="/seller/kyc"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3.5 px-6 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2 group"
                  >
                    View Application Status{' '}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ) : status === 'REJECTED' ? (
                  <Link
                    href={acceptedTerms ? '/seller/kyc' : '#'}
                    className={`w-full bg-red-600 hover:bg-red-700 text-white py-3.5 px-6 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2 group ${!acceptedTerms && 'opacity-50 cursor-not-allowed pointer-events-none'}`}
                  >
                    Re-submit Application{' '}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      if (!acceptedTerms) {
                        console.log('Terms not accepted');
                        toast.error(
                          'Please accept the Seller Agreement to proceed'
                        );
                        return;
                      }
                      console.log('Navigating to /seller/kyc');
                      window.location.href = '/seller/kyc';
                    }}
                    className={`w-full bg-foreground hover:bg-foreground/90 text-background py-3.5 px-6 rounded-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2 group ${!acceptedTerms && 'opacity-70'}`}
                  >
                    Submit Application{' '}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                )}
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <div className="flex gap-3">
                  <Info
                    className="text-blue-600 dark:text-blue-400 shrink-0"
                    size={20}
                  />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">
                      {status === 'VERIFIED'
                        ? 'Verification Success'
                        : status === 'PENDING'
                          ? 'Pending Verification'
                          : 'Approval Process'}
                    </p>
                    <p className="opacity-80 text-xs leading-relaxed">
                      {status === 'VERIFIED'
                        ? 'Your account is fully verified. You can now start listing luxury assets.'
                        : status === 'PENDING'
                          ? 'Our curation team is reviewing your documents. This usually takes 24-48 hours.'
                          : 'Applications for seller accounts are reviewed by our curation team within 48 hours.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 border-t border-border pt-12">
          <h3 className="text-2xl font-semibold mb-8 text-center   text-foreground">
            Common Questions
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-border">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <IndianRupee size={16} /> What are the fees?
              </h4>
              <p className="text-sm text-muted-foreground">
                We charge a flat 10% commission only when your item sells. No
                listing fees.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-border">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <Package size={16} /> How does shipping work?
              </h4>
              <p className="text-sm text-muted-foreground">
                You ship to our hub using a provided prepaid label. We handle
                delivery to the buyer.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-border">
              <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                <FileText size={16} /> What can I sell?
              </h4>
              <p className="text-sm text-muted-foreground">
                We accept luxury watches, sneakers, handbags, and collectibles
                valued over ₹500.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
