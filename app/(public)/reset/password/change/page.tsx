import { ChangePasswordForm } from '@/modules/reset/password/components/change-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 font-sans selection:bg-primary/20">
      <ChangePasswordForm />
    </div>
  );
}
