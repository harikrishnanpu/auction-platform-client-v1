export type WalletCurrency = string;

export interface IUserWallet {
  id: string;
  userId: string;
  mainBalance: number;
  heldBalance: number;
  currency: WalletCurrency;
}
