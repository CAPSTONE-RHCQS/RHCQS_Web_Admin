export interface BatchPaymentRequest {
  numberOfBatches: number;
  price: number;
  paymentDate: string;
  paymentPhase: string;
  percents: string;
  description: string;
}

export interface CreateContractDesignRequest {
  projectId: string;
  type: string;
  startDate: string;
  endDate: string;
  validityPeriod: number;
  taxCode: string;
  contractValue: number;
  urlFile: string | null;
  note: string;
  batchPaymentRequests: BatchPaymentRequest[];
}

export interface PaymentBatch {
  Priority: number | null;
  Id: string;
  Type: string;
  Status: string;
  InsDate: string;
  UpsDate: string;
  TotalPrice: number;
  PaymentDate: string;
  PaymentPhase: string;
  Unit: string;
  Percents: string;
  Description: string;
}
