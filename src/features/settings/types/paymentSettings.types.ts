export enum PaymentNumberType {
  VODAFONE_CASH = 1,
  INSTAPAY = 2,
}

export interface PaymentNumber {
  id?: number;
  type: PaymentNumberType;
  typeName: string;
  number: string;
  isActive: boolean;
}

export interface UpsertPaymentNumberDTO {
  type: PaymentNumberType;
  number: string;
  isActive: boolean;
}

export interface PaymentNumbersApiResponse {
  isSuccess: boolean;
  value: PaymentNumber[];
  message: string;
  errorType: number;
  errors: Record<string, string[]>;
}
