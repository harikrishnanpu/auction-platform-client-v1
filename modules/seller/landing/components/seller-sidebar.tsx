import Link from 'next/link';
import { ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { KycStatusEnum } from '@/types/kyc.type';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface SellerSidebarProps {
  kycStatus: KycStatusEnum | null;
  acceptedTerms: boolean;
  onSubmit: () => void;
}

export function SellerSidebar({
  kycStatus,
  acceptedTerms,
  onSubmit,
}: SellerSidebarProps) {
  const renderStatusBadge = () => {
    switch (kycStatus) {
      case KycStatusEnum.APPROVED:
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
            Verified
          </Badge>
        );
      case KycStatusEnum.PENDING:
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">
            Pending
          </Badge>
        );
      case KycStatusEnum.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Submitted</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-border sticky top-6">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
          <span className="text-xl font-bold text-muted-foreground">HS</span>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">Hari S.</h3>
          {/* <p className="text-sm text-muted-foreground">Member since 2021</p> */}
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
          <Progress value={98} className="h-1.5 [&>div]:bg-green-500" />
          <p className="text-xs text-muted-foreground mt-2">
            Your high trust score qualifies you for Tier 1 selling privileges.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {kycStatus === KycStatusEnum.APPROVED ? (
          <div className="w-full bg-green-600 text-white py-3.5 px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-lg shadow-green-500/20">
            <ShieldCheck size={18} /> Verified Seller
          </div>
        ) : kycStatus === KycStatusEnum.PENDING ? (
          <Button
            asChild
            className="w-full py-6 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-medium shadow-lg group"
          >
            <Link href="/seller/kyc">
              View Application Status{' '}
              <ArrowRight
                size={16}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Button>
        ) : kycStatus === KycStatusEnum.REJECTED ? (
          <Button
            asChild
            disabled={!acceptedTerms}
            variant="destructive"
            className="w-full py-6 rounded-xl font-medium shadow-lg group disabled:opacity-50"
          >
            <Link href={acceptedTerms ? '/seller/kyc' : '#'}>
              Re-submit Application{' '}
              <ArrowRight
                size={16}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            className={`w-full py-6 rounded-xl font-medium shadow-lg group ${!acceptedTerms ? 'opacity-70' : ''}`}
          >
            Submit Application{' '}
            <ArrowRight
              size={16}
              className="ml-2 transition-transform group-hover:translate-x-1"
            />
          </Button>
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
              {kycStatus === KycStatusEnum.APPROVED
                ? 'Verification Success'
                : kycStatus === KycStatusEnum.PENDING
                  ? 'Pending Verification'
                  : 'Approval Process'}
            </p>
            <p className="opacity-80 text-xs leading-relaxed">
              {kycStatus === KycStatusEnum.APPROVED
                ? 'Your account is fully verified. You can now start listing luxury assets.'
                : kycStatus === KycStatusEnum.PENDING
                  ? 'Our curation team is reviewing your documents. This usually takes 24-48 hours.'
                  : 'Applications for seller accounts are reviewed by our curation team within 48 hours.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
