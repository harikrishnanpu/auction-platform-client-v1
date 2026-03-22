import { Card } from '../ui/card';

export function AuthFormCard({
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card
      {...props}
      className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden animate-in fade-in duration-500 relative z-10"
    >
      {children}
    </Card>
  );
}
