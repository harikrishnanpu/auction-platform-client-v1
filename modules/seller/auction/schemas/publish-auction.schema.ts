import { z } from 'zod';

const nonNegativeInt = z.number().int('Must be a whole number').min(0);

const assetSchema = z.object({
  id: z.string().min(1, 'Asset id is required'),
  auctionId: z.string().min(1, 'Auction id is required'),
  fileKey: z.string().trim().min(1, 'Asset file key is required'),
  position: z.number().int().min(0),
  assetType: z.string().min(1),
});

export const publishAuctionValidationSchema = z
  .object({
    id: z.string().min(1, 'Auction id is required'),
    auctionType: z.enum(['LONG', 'LIVE', 'SEALED']),
    title: z
      .string()
      .trim()
      .min(1, 'Title is required')
      .max(200, 'Title must be at most 200 characters'),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .max(5000, 'Description must be at most 5000 characters'),
    category: z
      .string()
      .trim()
      .min(1, 'Category is required')
      .max(100, 'Category must be at most 100 characters'),
    condition: z
      .string()
      .trim()
      .min(1, 'Condition is required')
      .max(50, 'Condition must be at most 50 characters'),
    startPrice: z
      .number()
      .min(1, 'Start price must be 1 or greater')
      .finite('Start price must be a valid number'),
    minIncrement: z
      .number()
      .min(1, 'Min increment must be at least 1')
      .finite('Min increment must be a valid number'),
    startAt: z.string().min(1, 'Start time is required'),
    endAt: z.string().min(1, 'End time is required'),
    antiSnipSeconds: nonNegativeInt.min(0).max(300),
    maxExtensionCount: nonNegativeInt.min(0).max(10),
    bidCooldownSeconds: nonNegativeInt
      .min(1, 'Bid cooldown must be at least 1 second')
      .max(120),
    assets: z
      .array(assetSchema)
      .min(1, 'At least one image or video is required to publish'),
  })
  .refine(
    (data) => {
      const s = new Date(data.startAt);
      const e = new Date(data.endAt);
      if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return false;
      return e > s;
    },
    { message: 'End time must be after start time', path: ['endAt'] }
  )
  .refine(
    (data) => {
      const e = new Date(data.endAt);
      if (Number.isNaN(e.getTime())) return false;
      return e > new Date();
    },
    { message: 'End time must be in the future to publish', path: ['endAt'] }
  );

export type PublishAuctionValidationInput = z.infer<
  typeof publishAuctionValidationSchema
>;
