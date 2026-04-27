'use client';

type SystemConfigFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
};

export function SystemConfigField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 6,
}: SystemConfigFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
}
