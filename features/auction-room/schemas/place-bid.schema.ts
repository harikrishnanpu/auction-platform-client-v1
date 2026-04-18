import { z } from 'zod';

export type PlaceBidFormValues = {
  amount: string;
};

export function createPlaceBidSchema(minBid: number | null) {
  return z.object({
    amount: z.string().superRefine((val, ctx) => {
      if (minBid == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Auction not ready',
        });
        return;
      }
      const trimmed = val.trim();
      if (!trimmed) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a bid amount',
        });
        return;
      }
      const n = Number(trimmed);
      if (!Number.isFinite(n)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid number',
        });
        return;
      }
      if (n < minBid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Bid must be at least ${minBid}`,
        });
      }
    }),
  });
}

/** For react-hook-form `validate` — always uses current `minBid`. */
export function validatePlaceBidAmount(
  value: string,
  minBid: number | null
): true | string {
  const parsed = createPlaceBidSchema(minBid).safeParse({ amount: value });
  if (parsed.success) return true;
  return parsed.error.issues[0]?.message ?? 'Invalid';
}
