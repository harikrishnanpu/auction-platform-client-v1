import { describe, expect, it } from 'vitest';
import {
  isSellerAuctionRoomPath,
  isUserAuctionRoomPath,
  isAnyAuctionRoomPath,
  getAuctionRoomHeaderMeta,
  isUserNavActive,
  isSellerNavActive,
  isHomeArea,
  isSellerArea,
  isUserHomeArea,
} from '../app-nav';

describe('app-nav navigation utilities', () => {
  describe('isSellerAuctionRoomPath', () => {
    it('should return true for exact seller auction room paths', () => {
      expect(isSellerAuctionRoomPath('/seller/auctions/123')).toBe(true);
      expect(isSellerAuctionRoomPath('/seller/auctions/some-uuid')).toBe(true);
    });

    it('should return false for other seller paths or subpaths', () => {
      expect(isSellerAuctionRoomPath('/seller/auctions')).toBe(false);
      expect(isSellerAuctionRoomPath('/seller/auctions/123/edit')).toBe(false);
      expect(isSellerAuctionRoomPath('/auctions/123')).toBe(false);
    });
  });

  describe('isUserAuctionRoomPath', () => {
    it('should return true for user auction room paths', () => {
      expect(isUserAuctionRoomPath('/auction/123')).toBe(true);
      expect(isUserAuctionRoomPath('/auction/abc-xyz')).toBe(true);
    });

    it('should return false for other user paths', () => {
      expect(isUserAuctionRoomPath('/auctions')).toBe(false);
      expect(isUserAuctionRoomPath('/auction/123/bids')).toBe(false);
    });
  });

  describe('isAnyAuctionRoomPath', () => {
    it('should return true for either seller or user auction room paths', () => {
      expect(isAnyAuctionRoomPath('/seller/auctions/123')).toBe(true);
      expect(isAnyAuctionRoomPath('/auction/abc')).toBe(true);
    });

    it('should return false for other paths', () => {
      expect(isAnyAuctionRoomPath('/home')).toBe(false);
      expect(isAnyAuctionRoomPath('/seller/dashboard')).toBe(false);
    });
  });

  describe('getAuctionRoomHeaderMeta', () => {
    it('should return correct titles for seller vs user auction room', () => {
      expect(getAuctionRoomHeaderMeta('/seller/auctions/123')).toEqual({
        title: 'Auction Room',
        subtitle: 'Host, monitor bids, and manage this auction.',
      });
      expect(getAuctionRoomHeaderMeta('/auction/abc')).toEqual({
        title: 'Auction Room',
        subtitle: 'Place bids, follow the action, and chat with participants.',
      });
      expect(getAuctionRoomHeaderMeta('/home')).toBeNull();
    });
  });

  describe('isUserNavActive', () => {
    it('should handle exact matches and profile exemptions', () => {
      expect(isUserNavActive('/home', '/home')).toBe(true);
      expect(isUserNavActive('/auctions', '/auctions')).toBe(true);

      expect(isUserNavActive('/profile', '/profile')).toBe(true);
      expect(isUserNavActive('/profile/edit', '/profile')).toBe(true);
      expect(isUserNavActive('/profile/my-auctions', '/profile')).toBe(false);
      expect(
        isUserNavActive('/profile/my-auctions', '/profile/my-auctions')
      ).toBe(true);
    });
  });

  describe('isSellerNavActive', () => {
    it('should check active state for seller dashboard paths', () => {
      expect(isSellerNavActive('/seller/dashboard', '/seller/dashboard')).toBe(
        true
      );
      expect(
        isSellerNavActive('/seller/auctions/123', '/seller/auctions')
      ).toBe(true);
      expect(
        isSellerNavActive('/seller/auction/create', '/seller/auction/create')
      ).toBe(true);
    });
  });

  describe('Area check helpers', () => {
    it('should identify seller area vs home area correctly', () => {
      expect(isSellerArea('/seller/dashboard')).toBe(true);
      expect(isSellerArea('/home')).toBe(false);

      expect(isHomeArea('/home')).toBe(true);
      expect(isHomeArea('/seller/dashboard')).toBe(false);

      expect(isUserHomeArea('/auction/123')).toBe(true);
      expect(isUserHomeArea('/seller/auctions/123')).toBe(false);
    });
  });
});
