export interface IWallet extends Document {
  name: string;
  balance: number;
  kind: string;
  currency: string;
  user: string;
  walletId: string;
}
