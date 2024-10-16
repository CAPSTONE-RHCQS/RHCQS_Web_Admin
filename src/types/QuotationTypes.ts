export interface BatchPaymentInfo {
  Id: string;
  Description: string;
  Percents: string;
  Price: number;
  Unit: string;
  PaymentDate: string;
  PaymentPhase: string;
}

export interface EquipmentItem {
  Id: string;
  Name: string;
  Unit: string;
  Quantity: number;
  UnitOfMaterial: number;
  TotalOfMaterial: number;
  Note: string | null;
}

export interface FinalQuotationItem {
  Id: string;
  Name: string;
  Type: string;
  Unit: string;
  Weight: string;
  UnitPriceLabor: number | null;
  UnitPriceRough: number | null;
  TotalPriceLabor: number | null;
  TotalPriceRough: number | null;
  TotalPriceFinished: number | null;
  InsDate: string | null;
}

export interface FinalQuotationDetail {
  Id: string;
  AccountName: string;
  ProjectAddress: string;
  TotalPrice: number;
  Status: string;
  BatchPaymentInfos: BatchPaymentInfo[];
  EquipmentItems: EquipmentItem[];
  FinalQuotationItems: FinalQuotationItem[];
}
