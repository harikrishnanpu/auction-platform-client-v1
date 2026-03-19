import { z } from 'zod';

const nonNegativeInt = z.coerce.number().int('Must be a whole number').min(0);

export const createAuctionFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().default(''),
    categoryId: z.string().trim().min(1, 'Category is required'),
    condition: z.string().trim().min(1, 'Condition is required'),
    startPrice: z.coerce.number().min(500, 'Start price must be 500 or more'),
    minIncrement: z.coerce.number().min(1, 'Min increment must be 1 or more'),
    startAt: z.string().min(1, 'Start time is required'),
    endAt: z.string().min(1, 'End time is required'),
    antiSnipSeconds: nonNegativeInt.default(60),
    maxExtensionCount: nonNegativeInt.default(3),
    bidCooldownSeconds: nonNegativeInt.default(10),
  })
  .refine(
    (data) => {
      const s = new Date(data.startAt);
      const e = new Date(data.endAt);
      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return true; // let required handle empty
      return e > s;
    },
    { message: 'End time must be after start time', path: ['endAt'] }
  );

export type CreateAuctionFormValues = z.infer<typeof createAuctionFormSchema>;
