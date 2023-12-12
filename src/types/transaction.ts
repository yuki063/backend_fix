export interface ITransaction extends Document {
  description: string;
  amount: number;
  issue: string;
  users: string[];
}
