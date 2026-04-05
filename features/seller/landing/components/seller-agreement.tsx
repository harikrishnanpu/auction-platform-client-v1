import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SellerAgreementProps {
  acceptedTerms: boolean;
  onAcceptTerms: (checked: boolean) => void;
}

export function SellerAgreement({
  acceptedTerms,
  onAcceptTerms,
}: SellerAgreementProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-border">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">
        Seller Agreement
      </h2>
      <ScrollArea className="h-48 w-full rounded-md border border-border p-4 mb-6">
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground pr-4">
          <p>
            By applying to become a seller on HammerDown, you agree to our
            strict quality and authenticity standards. We maintain a
            zero-tolerance policy for counterfeits.
          </p>
          <p>
            <strong>1. Authenticity Guarantee:</strong> You certify that all
            items listed are 100% authentic. Any item found to be counterfeit
            will result in an immediate permanent ban and potential legal
            action.
          </p>
          <p>
            <strong>2. Listing Accuracy:</strong> You agree to represent the
            condition of your items accurately, disclosing all flaws,
            modifications, or repairs.
          </p>
          <p>
            <strong>3. Shipping Timelines:</strong> Items must be shipped to our
            authentication hub within 48 hours of a successful sale.
          </p>
          <p>
            <strong>4. Fee Structure:</strong> A standard commission fee of 10%
            is applied to the final hammer price. Payment processing fees may
            apply.
          </p>
          <p>
            <strong>5. Exclusivity:</strong> Items listed on HammerDown cannot
            be listed on other marketplaces simultaneously.
          </p>
        </div>
      </ScrollArea>
      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => onAcceptTerms(checked as boolean)}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none"
        >
          I have read and agree to the Seller Terms of Service and Commission
          Structure.
        </label>
      </div>
    </div>
  );
}
