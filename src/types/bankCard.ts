export interface IBankCard extends Document {
  nameOnCard: String;
  sourceId: string;
  nickName: string;
  user: string;
  status: "ACTIVATED" | "DEACTIVATED";
}
