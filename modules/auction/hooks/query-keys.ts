export const auctionQueryKeys = {
  all: ['auction'] as const,
  lists: () => [...auctionQueryKeys.all, 'list'] as const,
  list: (filters: { category?: string; auctionType?: string }) =>
    [...auctionQueryKeys.lists(), filters] as const,
  details: () => [...auctionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...auctionQueryKeys.details(), id] as const,
} as const;
