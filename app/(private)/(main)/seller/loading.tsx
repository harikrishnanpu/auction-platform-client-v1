import { Spinner } from '@/components/ui/spinner';

export default function SellerLoading() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] w-full min-w-0 items-center justify-center bg-transparent">
      <Spinner />
    </div>
  );
}
