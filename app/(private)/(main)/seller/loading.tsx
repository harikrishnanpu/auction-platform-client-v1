import { Spinner } from '@/components/ui/spinner';

export default function SellerLoading() {
  return (
    <div className="bg-background flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}
