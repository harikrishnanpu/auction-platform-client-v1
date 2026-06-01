import { z } from 'zod';
import { SELLER_AUCTION_VALIDATION } from '@/constants/seller/auction.constants';

const nonNegativeInt = z.coerce
  .number()
  .int(SELLER_AUCTION_VALIDATION.WHOLE_NUMBER)
  .min(0);

export const createAuctionFormSchema = z
  .object({
    title: z.string().trim().min(1, SELLER_AUCTION_VALIDATION.TITLE_REQUIRED),
    description: z.string().trim().default(''),
    categoryId: z
      .string()
      .trim()
      .min(1, SELLER_AUCTION_VALIDATION.CATEGORY_REQUIRED),
    condition: z
      .string()
      .trim()
      .min(1, SELLER_AUCTION_VALIDATION.CONDITION_REQUIRED),
    startPrice: z.coerce
      .number()
      .min(500, SELLER_AUCTION_VALIDATION.START_PRICE_MIN),
    minIncrement: z.coerce.number().min(0),
    startAt: z.string().min(1, SELLER_AUCTION_VALIDATION.START_TIME_REQUIRED),
    endAt: z.string().min(1, SELLER_AUCTION_VALIDATION.END_TIME_REQUIRED),
    antiSnipSeconds: nonNegativeInt.default(60),
    maxExtensionCount: nonNegativeInt.default(3),
    bidCooldownSeconds: nonNegativeInt.default(10),
    auctionType: z.enum(['LONG', 'LIVE', 'SEALED']).optional(),
  })
  .refine(
    (data) => {
      const s = new Date(data.startAt);
      const e = new Date(data.endAt);
      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return true;
      return e > s;
    },
    {
      message: SELLER_AUCTION_VALIDATION.END_AFTER_START,
      path: ['endAt'],
    }
  )
  .superRefine((data, ctx) => {
    const sealed = data.auctionType === 'SEALED';
    if (sealed) {
      const checks = [
        ['minIncrement', data.minIncrement],
        ['antiSnipSeconds', data.antiSnipSeconds],
        ['maxExtensionCount', data.maxExtensionCount],
        ['bidCooldownSeconds', data.bidCooldownSeconds],
      ] as const;
      for (const [path, val] of checks) {
        const n = Number(val);
        if (!Number.isFinite(n) || !Number.isInteger(n) || n !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: SELLER_AUCTION_VALIDATION.SEALED_ZERO,
            path: [path],
          });
        }
      }
    } else {
      if (Number(data.minIncrement) < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: SELLER_AUCTION_VALIDATION.MIN_INCREMENT_MIN,
          path: ['minIncrement'],
        });
      }
    }
  });

export type CreateAuctionFormValues = z.infer<typeof createAuctionFormSchema>;
