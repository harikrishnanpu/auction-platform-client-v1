import type {
  AuctionStatus,
  AuctionType,
  IGetAllSellerAuctionsFilter,
  IGetBrowseAuctionsFilter,
  IGetMyAuctionsFilter,
} from '@/types/auction.type';

export const BROWSE_DEFAULT_FILTERS: IGetBrowseAuctionsFilter = {
  auctionType: 'ALL',
  categoryId: 'ALL',
  page: 1,
  limit: 12,
  sort: 'startAt',
  order: 'desc',
  search: '',
};

export const MY_AUCTIONS_DEFAULT_FILTERS: IGetMyAuctionsFilter = {
  page: 1,
  limit: 10,
  search: '',
  auctionType: 'ALL',
  status: 'ALL',
  sort: 'startAt',
  order: 'desc',
};

function readString(
  params: Record<string, string | string[] | undefined>,
  key: string,
  fallback: string
): string {
  const raw = params[key];
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) return raw[0] ?? fallback;
  return fallback;
}

function readNumber(
  params: Record<string, string | string[] | undefined>,
  key: string,
  fallback: number
): number {
  const raw = readString(params, key, String(fallback));
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function readOrder(
  params: Record<string, string | string[] | undefined>
): 'asc' | 'desc' {
  const raw = readString(params, 'order', 'desc');
  return raw === 'asc' ? 'asc' : 'desc';
}

export function parseBrowseFilters(
  params: Record<string, string | string[] | undefined>
): IGetBrowseAuctionsFilter {
  const auctionType = readString(params, 'auctionType', 'ALL');
  const validTypes = new Set(['ALL', 'LONG', 'LIVE', 'SEALED']);

  return {
    auctionType: validTypes.has(auctionType)
      ? (auctionType as AuctionType | 'ALL')
      : BROWSE_DEFAULT_FILTERS.auctionType,
    categoryId: readString(params, 'categoryId', 'ALL'),
    page: readNumber(params, 'page', BROWSE_DEFAULT_FILTERS.page),
    limit: readNumber(params, 'limit', BROWSE_DEFAULT_FILTERS.limit),
    sort: readString(params, 'sort', BROWSE_DEFAULT_FILTERS.sort),
    order: readOrder(params),
    search: readString(params, 'search', ''),
  };
}

export function buildBrowseSearchParams(
  filters: IGetBrowseAuctionsFilter
): string {
  const q = new URLSearchParams();

  if (filters.search.trim()) q.set('search', filters.search.trim());
  if (filters.auctionType !== 'ALL') q.set('auctionType', filters.auctionType);
  if (filters.categoryId !== 'ALL') q.set('categoryId', filters.categoryId);
  if (filters.page !== 1) q.set('page', String(filters.page));
  if (filters.limit !== BROWSE_DEFAULT_FILTERS.limit) {
    q.set('limit', String(filters.limit));
  }
  if (filters.sort !== BROWSE_DEFAULT_FILTERS.sort) q.set('sort', filters.sort);
  if (filters.order !== BROWSE_DEFAULT_FILTERS.order) {
    q.set('order', filters.order);
  }

  return q.toString();
}

export function applyBrowseFilterUpdate<
  K extends keyof IGetBrowseAuctionsFilter,
>(
  prev: IGetBrowseAuctionsFilter,
  key: K,
  value: IGetBrowseAuctionsFilter[K]
): IGetBrowseAuctionsFilter {
  const shouldResetPage =
    key === 'auctionType' ||
    key === 'categoryId' ||
    key === 'search' ||
    key === 'sort' ||
    key === 'order' ||
    key === 'limit';

  return {
    ...prev,
    [key]: value,
    ...(shouldResetPage ? { page: 1 } : {}),
  };
}

export function countBrowseActiveFilters(
  filters: IGetBrowseAuctionsFilter
): number {
  let count = 0;
  if (String(filters.auctionType) !== 'ALL') count += 1;
  if (filters.categoryId !== 'ALL') count += 1;
  if (filters.search.trim()) count += 1;
  if (
    filters.sort !== BROWSE_DEFAULT_FILTERS.sort ||
    filters.order !== BROWSE_DEFAULT_FILTERS.order
  ) {
    count += 1;
  }
  if (filters.limit !== BROWSE_DEFAULT_FILTERS.limit) count += 1;
  return count;
}

export function parseMyAuctionsFilters(
  params: Record<string, string | string[] | undefined>
): IGetMyAuctionsFilter {
  const auctionType = readString(params, 'auctionType', 'ALL');
  const status = readString(params, 'status', 'ALL');
  const validTypes = new Set(['ALL', 'LONG', 'LIVE', 'SEALED']);
  const validStatuses = new Set([
    'ALL',
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'ENDED',
    'SOLD',
    'CANCELLED',
  ]);

  return {
    page: readNumber(params, 'page', MY_AUCTIONS_DEFAULT_FILTERS.page),
    limit: readNumber(params, 'limit', MY_AUCTIONS_DEFAULT_FILTERS.limit),
    search: readString(params, 'search', ''),
    auctionType: validTypes.has(auctionType)
      ? (auctionType as IGetMyAuctionsFilter['auctionType'])
      : MY_AUCTIONS_DEFAULT_FILTERS.auctionType,
    status: validStatuses.has(status)
      ? (status as IGetMyAuctionsFilter['status'])
      : MY_AUCTIONS_DEFAULT_FILTERS.status,
    sort: readString(params, 'sort', MY_AUCTIONS_DEFAULT_FILTERS.sort),
    order: readOrder(params),
  };
}

export function buildMyAuctionsSearchParams(
  filters: IGetMyAuctionsFilter
): string {
  const q = new URLSearchParams();

  if (filters.search.trim()) q.set('search', filters.search.trim());
  if (filters.auctionType !== 'ALL') q.set('auctionType', filters.auctionType);
  if (filters.status !== 'ALL') q.set('status', filters.status);
  if (filters.page !== 1) q.set('page', String(filters.page));
  if (filters.limit !== MY_AUCTIONS_DEFAULT_FILTERS.limit) {
    q.set('limit', String(filters.limit));
  }
  if (filters.sort !== MY_AUCTIONS_DEFAULT_FILTERS.sort) {
    q.set('sort', filters.sort);
  }
  if (filters.order !== MY_AUCTIONS_DEFAULT_FILTERS.order) {
    q.set('order', filters.order);
  }

  return q.toString();
}

export function applyMyAuctionsFilterUpdate<
  K extends keyof IGetMyAuctionsFilter,
>(
  prev: IGetMyAuctionsFilter,
  key: K,
  value: IGetMyAuctionsFilter[K]
): IGetMyAuctionsFilter {
  return {
    ...prev,
    [key]: value,
    page: key === 'page' ? (value as number) : 1,
  };
}

export function countMyAuctionsActiveFilters(
  filters: IGetMyAuctionsFilter
): number {
  let count = 0;
  if (filters.search) count += 1;
  if (filters.auctionType !== 'ALL') count += 1;
  if (filters.status !== 'ALL') count += 1;
  if (filters.sort !== MY_AUCTIONS_DEFAULT_FILTERS.sort) count += 1;
  if (filters.order !== MY_AUCTIONS_DEFAULT_FILTERS.order) count += 1;
  if (filters.limit !== MY_AUCTIONS_DEFAULT_FILTERS.limit) count += 1;
  return count;
}

export function readPageParam(
  params: Record<string, string | string[] | undefined>,
  fallback = 1
): number {
  return readNumber(params, 'page', fallback);
}

export const SELLER_AUCTIONS_DEFAULT_FILTERS: IGetAllSellerAuctionsFilter = {
  status: 'ALL',
  auctionType: 'ALL',
  categoryId: 'ALL',
  page: 1,
  limit: 8,
  sort: 'startAt',
  order: 'desc',
  search: '',
};

export const ADMIN_AUCTIONS_DEFAULT_FILTERS: IGetBrowseAuctionsFilter = {
  auctionType: 'ALL',
  categoryId: 'ALL',
  page: 1,
  limit: 8,
  sort: 'startAt',
  order: 'desc',
  search: '',
};

export function parseSellerAuctionFilters(
  params: Record<string, string | string[] | undefined>
): IGetAllSellerAuctionsFilter {
  const auctionType = readString(params, 'auctionType', 'ALL');
  const status = readString(params, 'status', 'ALL');
  const validTypes = new Set(['ALL', 'LONG', 'LIVE', 'SEALED']);
  const validStatuses = new Set([
    'ALL',
    'DRAFT',
    'PUBLISHED',
    'ACTIVE',
    'PAUSED',
    'ENDED',
    'SOLD',
    'CANCELLED',
  ]);

  return {
    status: validStatuses.has(status)
      ? (status as AuctionStatus | 'ALL')
      : SELLER_AUCTIONS_DEFAULT_FILTERS.status,
    auctionType: validTypes.has(auctionType)
      ? (auctionType as AuctionType | 'ALL')
      : SELLER_AUCTIONS_DEFAULT_FILTERS.auctionType,
    categoryId: readString(params, 'categoryId', 'ALL'),
    page: readNumber(params, 'page', SELLER_AUCTIONS_DEFAULT_FILTERS.page),
    limit: readNumber(params, 'limit', SELLER_AUCTIONS_DEFAULT_FILTERS.limit),
    sort: readString(params, 'sort', SELLER_AUCTIONS_DEFAULT_FILTERS.sort),
    order: readOrder(params),
    search: readString(params, 'search', ''),
  };
}

export function buildSellerAuctionSearchParams(
  filters: IGetAllSellerAuctionsFilter
): string {
  const q = new URLSearchParams();

  if (filters.search.trim()) q.set('search', filters.search.trim());
  if (filters.status !== 'ALL') q.set('status', filters.status);
  if (filters.auctionType !== 'ALL') q.set('auctionType', filters.auctionType);
  if (filters.categoryId !== 'ALL') q.set('categoryId', filters.categoryId);
  if (filters.page !== 1) q.set('page', String(filters.page));
  if (filters.limit !== SELLER_AUCTIONS_DEFAULT_FILTERS.limit) {
    q.set('limit', String(filters.limit));
  }
  if (filters.sort !== SELLER_AUCTIONS_DEFAULT_FILTERS.sort) {
    q.set('sort', filters.sort);
  }
  if (filters.order !== SELLER_AUCTIONS_DEFAULT_FILTERS.order) {
    q.set('order', filters.order);
  }

  return q.toString();
}

export function applySellerAuctionFilterUpdate<
  K extends keyof IGetAllSellerAuctionsFilter,
>(
  prev: IGetAllSellerAuctionsFilter,
  key: K,
  value: IGetAllSellerAuctionsFilter[K]
): IGetAllSellerAuctionsFilter {
  const shouldResetPage =
    key === 'status' ||
    key === 'auctionType' ||
    key === 'categoryId' ||
    key === 'search' ||
    key === 'sort' ||
    key === 'order' ||
    key === 'limit';

  return {
    ...prev,
    [key]: value,
    ...(shouldResetPage ? { page: 1 } : {}),
  };
}

export function countSellerAuctionActiveFilters(
  filters: IGetAllSellerAuctionsFilter
): number {
  let count = 0;
  if (String(filters.status) !== 'ALL') count += 1;
  if (String(filters.auctionType) !== 'ALL') count += 1;
  if (filters.categoryId !== 'ALL') count += 1;
  if (filters.search.trim()) count += 1;
  if (
    filters.sort !== SELLER_AUCTIONS_DEFAULT_FILTERS.sort ||
    filters.order !== SELLER_AUCTIONS_DEFAULT_FILTERS.order
  ) {
    count += 1;
  }
  if (filters.limit !== SELLER_AUCTIONS_DEFAULT_FILTERS.limit) count += 1;
  return count;
}

export function parseAdminAuctionFilters(
  params: Record<string, string | string[] | undefined>
): IGetBrowseAuctionsFilter {
  const parsed = parseBrowseFilters(params);

  return {
    ...parsed,
    limit: readNumber(params, 'limit', ADMIN_AUCTIONS_DEFAULT_FILTERS.limit),
  };
}

export function countAdminAuctionActiveFilters(
  filters: IGetBrowseAuctionsFilter
): number {
  let count = 0;
  if (String(filters.auctionType) !== 'ALL') count += 1;
  if (filters.categoryId !== 'ALL') count += 1;
  if (filters.search.trim()) count += 1;
  if (
    filters.sort !== ADMIN_AUCTIONS_DEFAULT_FILTERS.sort ||
    filters.order !== ADMIN_AUCTIONS_DEFAULT_FILTERS.order
  ) {
    count += 1;
  }
  if (filters.limit !== ADMIN_AUCTIONS_DEFAULT_FILTERS.limit) count += 1;
  return count;
}
