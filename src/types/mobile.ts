export type MobileAirTimePayment = {
  requestId?: string;
  vendorId: string;
  mobileNumber: string;
  amount: number;
  vendMetaData: {
    transactionRequestDateTime: string;
    transactionReference: string;
    vendorId: string;
    deviceId: string;
    consumerAccountNumber: string;
  };
};

export type MobileDataPayment = {
  requestId: string;
  vendorId: string;
  productId: string;
  mobileNumber: string;
  vendMetaData: {
    transactionRequestDateTime: string;
    transactionReference: string;
    vendorId: string;
    deviceId: string;
    consumerAccountNumber: string;
  };
};
