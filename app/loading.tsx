import { Spinner } from '@/components/ui/spinner';

const loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
};

export default loading;
