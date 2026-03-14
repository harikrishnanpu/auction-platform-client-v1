export const auctionKeys = {
  browse: (category?: string, auctionType?: string) =>
    ['auction', 'browse', category, auctionType] as const,

  detail: (id: string, mode: 'seller' | 'user' = 'user') =>
    ['auction', 'detail', id, mode] as const,

  room: (id: string, mode: 'seller' | 'user') =>
    ['auction', 'room', id, mode] as const,
};
