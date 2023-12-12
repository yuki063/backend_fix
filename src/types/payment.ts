export interface ElectricityPayment {
    amount: Number;
    meterNumber: string;
    paymentType: "CASH" | "CREDIT_CARD" | " DEBIT_CARD" | " CHEQUE" | " EFT" | " TRADING_ACCOUNT" | " OTHER";
    track2Data?: string;
    transactionType: string;
    linkedWalletOrCardId: string;
}