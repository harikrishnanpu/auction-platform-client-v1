'use client';

import { createContext, useContext, type ReactNode } from 'react';

const AuctionRoomMenuContext = createContext<(() => void) | null>(null);

export function AuctionRoomMenuProvider({
  onMenuOpen,
  children,
}: {
  onMenuOpen: () => void;
  children: ReactNode;
}) {
  return (
    <AuctionRoomMenuContext.Provider value={onMenuOpen}>
      {children}
    </AuctionRoomMenuContext.Provider>
  );
}

export function useAuctionRoomMenu() {
  return useContext(AuctionRoomMenuContext);
}

export const SellerRoomMenuProvider = AuctionRoomMenuProvider;

export const useSellerRoomMenu = useAuctionRoomMenu;
