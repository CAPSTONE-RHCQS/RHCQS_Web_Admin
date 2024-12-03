export interface PackageQuotation {
  IdPackageRough: string | null;
  PackageRough: string;
  UnitPackageRough: number;
  IdPackageFinished: string | null;
  PackageFinished: string;
  UnitPackageFinished: number;
  Unit: string;
}

export interface ItemInitial {
  Id: string;
  Name: string;
  ConstructionItemId: string;
  SubConstruction: string | null;
  SubConstructionId: string | null;
  Area: number;
  Price: number;
  UnitPrice: string;
  SubCoefficient: number | null;
  Coefficient: number;
}

export interface UtilityInfo {
  Id: string;
  Description: string;
  Coefficient: number;
  Quantity: number | null;
  UnitPrice: number;
  Price: number;
}

export interface PromotionInfo {
  Id: string;
  Name: string | null;
  Value: number | null;
}

export interface BatchPaymentInfo {
  NumberOfBatch: number;
  PaymentId: string;
  Status: string;
  Description: string;
  Percents: number;
  Price: number;
  Unit: string;
  InsDate: string | null;
  PaymentDate: string | null;
  PaymentPhase: string | null;
}

export interface InitialQuotationResponse {
  Id: string;
  AccountName: string;
  ProjectType: string;
  Address: string;
  ProjectId: string;
  Area: number;
  TimeProcessing: number;
  TimeOthers: number;
  TimeRough: number;
  OthersAgreement: string;
  InsDate: string;
  Status: string;
  Version: number;
  Deflag: boolean;
  Note: string | null;
  TotalRough: number;
  TotalFinished: number;
  TotalUtilities: number;
  Discount: number;
  Unit: string;
  ReasonReject: string | null;
  PackageQuotationList: PackageQuotation;
  ItemInitial: ItemInitial[];
  UtilityInfos: UtilityInfo[];
  PromotionInfo: PromotionInfo | null;
  BatchPaymentInfos: BatchPaymentInfo[];
}

interface Item {
  name: string;
  constructionItemId: string;
  subConstructionId: string | null;
  area: number;
  price: number;
}

export interface Package {
  packageId: string | null;
  type: string;
}

export interface QuotationUtility {
  utilitiesItemId: string;
  coefficient: number;
  price: number;
  description: string;
  quantity: number | null;
}

export interface Promotion {
  id: string | null;
}

export interface BatchPayment {
  numberOfBatch: number;
  price: number;
  percents: number;
  description: string;
  paymentDate: string;
  paymentPhase: string;
}

export interface UpdateInitialQuotationRequest {
  accountName: string;
  address: string;
  versionPresent: number;
  projectId: string;
  isSave: boolean;
  area: number;
  timeProcessing: number;
  timeRough: number;
  timeOthers: number;
  othersAgreement: string;
  totalRough: number;
  totalFinished: number;
  totalUtilities: number;
  items: Item[];
  packages: Package[];
  utilities: QuotationUtility[];
  promotions: PromotionWithDiscount | null;
  batchPayments: BatchPayment[];
}

interface PromotionWithDiscount {
  id: string;
  discount: number;
}
