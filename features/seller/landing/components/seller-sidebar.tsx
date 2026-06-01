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
          <Badge variant="outline" className="font-medium">
            Verified
          </Badge>
        );
      case KycStatusEnum.PENDING:
        return (
          <Badge variant="secondary" className="font-medium">
            Pending
          </Badge>
        );
      case KycStatusEnum.REJECTED:
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not submitted</Badge>;
    }
  };

  return (
    <div className="sticky top-6 rounded-xl border border-border bg-muted/25 p-6">
      {/* Profile Section */}
      <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
          <span className="text-lg font-semibold text-muted-foreground">
            HS
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Hari S.</h3>
          <div className="mt-1 flex w-fit items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground">
            <ShieldCheck size={12} aria-hidden /> Verified ID
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
      <div className="mb-8 space-y-4">
        <div>
          <div className="mb-2 flex items-end justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Seller eligibility
            </p>
            <span className="text-xs font-semibold text-foreground">
              Excellent
            </span>
          </div>
          <div className="mb-1 flex items-end gap-2">
            <span className="text-3xl font-semibold tracking-tight text-foreground">
              98
              <span className="text-lg font-normal text-muted-foreground">
                /100
              </span>
            </span>
          </div>
          <Progress value={98} className="h-1.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            Your trust score qualifies you for Tier 1 selling privileges.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {kycStatus === KycStatusEnum.APPROVED ? (
          <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground">
            <ShieldCheck size={18} aria-hidden /> Verified seller
          </div>
        ) : kycStatus === KycStatusEnum.PENDING ? (
          <Button className="group h-auto w-full rounded-lg py-6 text-base font-semibold">
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
            disabled={!acceptedTerms}
            variant="destructive"
            className="group h-auto w-full rounded-lg py-6 text-base font-semibold disabled:opacity-50"
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
            className={`group h-auto w-full rounded-lg py-6 text-base font-semibold ${!acceptedTerms ? 'opacity-70' : ''}`}
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
      <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex gap-3">
          <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div className="text-sm text-foreground">
            <p className="mb-1 font-semibold">
              {kycStatus === KycStatusEnum.APPROVED
                ? 'Verification complete'
                : kycStatus === KycStatusEnum.PENDING
                  ? 'Pending verification'
                  : 'Approval process'}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {kycStatus === KycStatusEnum.APPROVED
                ? 'Your account is verified. You can list auctions from the dashboard.'
                : kycStatus === KycStatusEnum.PENDING
                  ? 'Our team is reviewing your documents. This usually takes 24–48 hours.'
                  : 'Seller applications are reviewed within about 48 hours.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
