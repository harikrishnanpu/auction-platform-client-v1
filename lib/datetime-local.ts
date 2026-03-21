export function isoToDatetimeLocal(isoOrDate: unknown): string {
  const d = isoOrDate instanceof Date ? isoOrDate : new Date(String(isoOrDate));
  if (Number.isNaN(d.getTime())) return '';

  const pad = (n: number) => String(n).padStart(2, '0');
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Convert `datetime-local` value (local wall-clock, no timezone) -> ISO string.
 * This preserves the wall-clock time in the user's timezone.
 */
export function datetimeLocalToISO(value: string): string {
  if (!value) return '';
  const [datePart, timePart] = value.split('T');
  if (!datePart || !timePart) return new Date(value).toISOString();

  const [y, m, d] = datePart.split('-').map((x) => Number(x));
  const [hh, mm] = timePart.split(':').map((x) => Number(x));

  // Use local time components so wall-clock is preserved.
  const dt = new Date(y, m - 1, d, hh, mm, 0);
  return dt.toISOString();
}
