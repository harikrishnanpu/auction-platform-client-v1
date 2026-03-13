export const DUMMY_DASHBOARD_STATS = {
  totalEarnings: '₹ 12,45,000',
  totalEarningsTrend: { value: '+12.5%', positive: true },
  withdrawableBalance: '₹ 82,500',
  pendingClearance: '₹ 1,25,000',
  pendingClearanceSubtext: 'Clears in ~3 days',
  activeLotsValue: '₹ 2,40,000',
  activeLotsCount: 4,
} as const;

export interface DummyAuctionItem {
  id: string;
  title: string;
  category: string;
  startPrice: number;
  status: 'ACTIVE' | 'DRAFT' | 'ENDED';
  startTime: string;
  imageUrl: string;
  soldPrice?: number;
  fee?: string;
  net?: string;
}

export const DUMMY_AUCTIONS: DummyAuctionItem[] = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    category: 'Watches',
    startPrice: 85000,
    status: 'ACTIVE',
    startTime: '2025-03-10T10:00:00Z',
    imageUrl: 'https://placehold.co/200x200?text=Rolex',
    soldPrice: 92000,
    fee: '₹ 11,040',
    net: '₹ 80,960',
  },
  {
    id: '2',
    title: 'Handwoven Silk Saree',
    category: 'Textiles',
    startPrice: 45000,
    status: 'ACTIVE',
    startTime: '2025-03-12T14:00:00Z',
    imageUrl: 'https://placehold.co/200x200?text=Saree',
    soldPrice: 48000,
    fee: '₹ 5,760',
    net: '₹ 42,240',
  },
  {
    id: '3',
    title: 'Antique Brass Idol',
    category: 'Collectibles',
    startPrice: 32000,
    status: 'DRAFT',
    startTime: '2025-03-15T09:00:00Z',
    imageUrl: 'https://placehold.co/200x200?text=Idol',
  },
  {
    id: '4',
    title: 'Classic Leather Bag',
    category: 'Accessories',
    startPrice: 28000,
    status: 'ACTIVE',
    startTime: '2025-03-08T11:00:00Z',
    imageUrl: 'https://placehold.co/200x200?text=Bag',
    soldPrice: 31000,
    fee: '₹ 3,720',
    net: '₹ 27,280',
  },
  {
    id: '5',
    title: 'Silver Filigree Set',
    category: 'Jewelry',
    startPrice: 55000,
    status: 'ACTIVE',
    startTime: '2025-03-11T16:00:00Z',
    imageUrl: 'https://placehold.co/200x200?text=Silver',
    soldPrice: 60000,
    fee: '₹ 7,200',
    net: '₹ 52,800',
  },
];
