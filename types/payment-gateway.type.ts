export interface IPaymentGatewayOrder {
  paymentId: string;
  orderId: string;
  amountInPaise: number;
  currency: string;
  gatewayKey: string;
}

export interface IVerifyGatewayPaymentInput {
  paymentId: string;
  orderId: string;
  gatewayPaymentId: string;
  signature: string;
}
