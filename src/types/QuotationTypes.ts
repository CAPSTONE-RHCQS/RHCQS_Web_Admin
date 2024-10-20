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
  UnitPriceFinished: number | null;
  TotalPriceLabor: number | null;
  TotalPriceRough: number | null;
  TotalPriceFinished: number | null;
  InsDate: string | null;
}

export interface PromotionInfo {
  Id: string;
  Name: string;
  Percents: string;
  Price: number;
  Unit: string;
}

export interface UtilityInfo {
  Id: string;
  Description: string;
  Coefficient: number;
  Price: number;
}

export interface ConstructionDetail {
  Type: string;
  TotalPriceRough: number;
  TotalPriceLabor: number;
}

export interface FinalQuotationDetail {
  Id: string;
  AccountName: string;
  StaffName: string | null;
  ProjectId: string;
  ProjectType: string;
  ProjectAddress: string;
  PromotionId: string | null;
  TotalPrice: number;
  Note: string | null;
  Version: number;
  InsDate: string;
  UpsDate: string;
  Status: string;
  Deflag: boolean;
  QuotationUtilitiesId: string | null;
  ReasonReject: string | null;
  BatchPaymentInfos: BatchPaymentInfo[];
  EquipmentItems: EquipmentItem[];
  FinalQuotationItems: FinalQuotationItem[];
  PromotionInfo: PromotionInfo | null;
  UtilityInfos: UtilityInfo[];
  ConstructionRough: ConstructionDetail;
  ConstructionFinished: ConstructionDetail;
}
