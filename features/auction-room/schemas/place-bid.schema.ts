import { z } from 'zod';
import { AUCTION_ROOM_VALIDATION } from '@/constants/auction-room/constants';
import { COMMON_VALIDATION } from '@/constants/common/validation.constants';

export type PlaceBidFormValues = {
  amount: string;
};

export function createPlaceBidSchema(minBid: number | null) {
  return z.object({
    amount: z.string().superRefine((val, ctx) => {
      if (minBid == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: AUCTION_ROOM_VALIDATION.NOT_READY,
        });
        return;
      }
      const trimmed = val.trim();
      if (!trimmed) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: AUCTION_ROOM_VALIDATION.AMOUNT_REQUIRED,
        });
        return;
      }
      const n = Number(trimmed);
      if (!Number.isFinite(n)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: AUCTION_ROOM_VALIDATION.INVALID_NUMBER,
        });
        return;
      }
      if (n < minBid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: AUCTION_ROOM_VALIDATION.minBid(minBid),
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
  return parsed.error.issues[0]?.message ?? COMMON_VALIDATION.GENERIC_INVALID;
}
