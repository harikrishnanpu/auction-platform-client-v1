import { z } from 'zod';

const nonNegativeInt = z.coerce.number().int('Must be a whole number').min(0);

export const updateAuctionFormSchema = z
  .object({
    auctionType: z.enum(['LONG', 'LIVE', 'SEALED']),
    title: z.string().trim().min(1, 'Title is required'),
    description: z.string().trim().default(''),
    category: z.string().trim().min(1, 'Category is required'),
    condition: z.string().trim().min(1, 'Condition is required'),
    startPrice: z.coerce.number().min(0, 'Start price must be 0 or more'),
    minIncrement: z.coerce.number().min(0, 'Min increment must be 0 or more'),
    startAt: z.string().min(1, 'Start time is required'),
    endAt: z.string().min(1, 'End time is required'),
    antiSnipSeconds: nonNegativeInt,
    maxExtensionCount: nonNegativeInt,
    bidCooldownSeconds: nonNegativeInt,
  })
  .refine(
    (data) => {
      const s = new Date(data.startAt);
      const e = new Date(data.endAt);
      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return true;
      return e > s;
    },
    { message: 'End time must be after start time', path: ['endAt'] }
  );

export type UpdateAuctionFormValues = z.infer<typeof updateAuctionFormSchema>;
