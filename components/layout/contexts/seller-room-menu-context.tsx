'use client';

import { createContext, useContext, type ReactNode } from 'react';

const SellerRoomMenuContext = createContext<(() => void) | null>(null);

export function SellerRoomMenuProvider({
  onMenuOpen,
  children,
}: {
  onMenuOpen: () => void;
  children: ReactNode;
}) {
  return (
    <SellerRoomMenuContext.Provider value={onMenuOpen}>
      {children}
    </SellerRoomMenuContext.Provider>
  );
}

export function useSellerRoomMenu() {
  return useContext(SellerRoomMenuContext);
}
