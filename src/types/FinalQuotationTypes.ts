export interface BatchPaymentInfo {
  PaymentId: string;
  PaymentTypeId: string;
  PaymentTypeName: string;
  ContractId: string;
  InsDate: string;
  Status: string;
  UpsDate: string;
  Price: number;
  PaymentDate: string;
  PaymentPhase: string;
  Unit: string;
  Percents: string;
  Description: string;
}

export interface EquipmentItem {
  Id: string;
  Name: string;
  Unit: string;
  Quantity: number;
  UnitOfMaterial: number;
  TotalOfMaterial: number;
  Note: string | null;
  Type: string;
}

export interface QuotationItem {
  Id: string;
  LaborId: string | null;
  MaterialId: string | null;
  Name: string;
  Unit: string;
  Weight: number;
  UnitPriceLabor: number | null;
  UnitPriceRough: number | null;
  UnitPriceFinished: number | null;
  TotalPriceLabor: number | null;
  TotalPriceRough: number | null;
  TotalPriceFinished: number | null;
  InsDate: string | null;
  UpsDate: string | null;
  Note: string | null;
}

export interface FinalQuotationItem {
  Id: string;
  ConstructionId: string;
  SubConstructionId: string | null;
  ContructionName: string;
  Type: string;
  Coefficient: number;
  InsDate: string | null;
  QuotationItems: QuotationItem[];
}

export interface PromotionInfo {
  Id: string;
  Name: string;
  Value: number;
}

export interface UtilityInfo {
  Id: string;
  utilitiesItemId: string;
  utilitiesSectionId: string;
  Name: string;
  Description: string;
  Coefficient: number;
  Price: number;
  UnitPrice: number;
  Unit: string;
}

export interface ConstructionDetail {
  Type: string;
  TotalPriceRough: number;
  TotalPriceLabor: number;
}

export interface Equitment {
  Type: string;
  TotalPriceRough: number;
  TotalPriceLabor: number;
}

export interface FinalQuotationDetail {
  Id: string;
  AccountName: string;
  ProjectId: string;
  InitailQuotationId: string;
  ProjectType: string;
  ProjectAddress: string;
  TotalPrice: number;
  Note: string | null;
  Version: number;
  InsDate: string;
  UpsDate: string;
  Status: string;
  Deflag: boolean;
  ReasonReject: string | null;
  BatchPaymentInfos: BatchPaymentInfo[];
  EquipmentItems: EquipmentItem[];
  FinalQuotationItems: FinalQuotationItem[];
  PromotionInfo: PromotionInfo | null;
  UtilityInfos: UtilityInfo[];
  ConstructionRough: ConstructionDetail;
  ConstructionFinished: ConstructionDetail;
  Equitment: Equitment;
}

export interface FinalQuotationResponse {
  Id: string;
  AccountName: string;
  ProjectId: string;
  InitailQuotationId: string;
  ProjectType: string;
  ProjectAddress: string;
  TotalPrice: number;
  Note: string | null;
  Version: number;
  InsDate: string;
  UpsDate: string;
  Status: string;
  Deflag: boolean;
  ReasonReject: string | null;
  BatchPaymentInfos: BatchPaymentInfo[];
  EquipmentItems: EquipmentItem[];
  FinalQuotationItems: FinalQuotationItem[];
  PromotionInfo: PromotionInfo | null;
  UtilityInfos: UtilityInfo[];
  ConstructionRough: ConstructionDetail;
  ConstructionFinished: ConstructionDetail;
  Equitment: Equitment;
}
