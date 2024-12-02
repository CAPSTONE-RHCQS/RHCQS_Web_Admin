export interface BatchPaymentInfoRequest {
  numberOfBatch: number;
  price: number;
  paymentDate: string;
  paymentPhase: string;
}

export interface EquipmentItemRequest {
  name: string;
  unit: string;
  quantity: number;
  unitOfMaterial: number;
  note: string;
  type: string;
}

export interface UtilityRequest {
  utilitiesItemId: string;
  coefficient: number;
  price: number;
  description: string;
  quantity: number | null;
}

export interface QuotationItemRequest {
  unit: string;
  workTemplateId: string;
  weight: number;
  unitPriceLabor: number;
  unitPriceRough: number;
  unitPriceFinished: number;
  totalPriceLabor: number;
  totalPriceRough: number;
  totalPriceFinished: number;
  note: string;
}

export interface FinalQuotationItemRequest {
  constructionId: string;
  subconstructionId: string | null;
  quotationItems: QuotationItemRequest[];
}

export interface FinalQuotationRequest {
  customerName: string;
  address: string;
  projectId: string;
  promotionId: string | null;
  note: string;
  batchPaymentInfos: BatchPaymentInfoRequest[];
  equipmentItems: EquipmentItemRequest[];
  utilities: UtilityRequest[];
  finalQuotationItems: FinalQuotationItemRequest[];
}
