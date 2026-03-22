import { z } from 'zod';

const nonNegativeInt = z.coerce.number().int('Must be a whole number').min(0);

export const createAuctionFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().default(''),
    categoryId: z.string().trim().min(1, 'Category is required'),
    condition: z.string().trim().min(1, 'Condition is required'),
    startPrice: z.coerce.number().min(500, 'Start price must be 500 or more'),
    minIncrement: z.coerce.number().min(0),
    startAt: z.string().min(1, 'Start time is required'),
    endAt: z.string().min(1, 'End time is required'),
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
    { message: 'End time must be after start time', path: ['endAt'] }
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
            message: 'Must be 0 for sealed auctions',
            path: [path],
          });
        }
      }
    } else {
      if (Number(data.minIncrement) < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Min increment must be 1 or more',
          path: ['minIncrement'],
        });
      }
    }
  });

export type CreateAuctionFormValues = z.infer<typeof createAuctionFormSchema>;
