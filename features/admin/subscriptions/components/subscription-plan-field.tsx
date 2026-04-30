'use client';

type SubscriptionPlanFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number';
};

export function SubscriptionPlanField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: SubscriptionPlanFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
