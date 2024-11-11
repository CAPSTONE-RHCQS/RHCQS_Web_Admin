export interface BatchPaymentInfoRequest {
  initIntitialQuotationId: string;
  paymentTypeId: string;
  contractId: string;
  price: number;
  percents: string;
  description: string;
  status: string;
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
  price: number;
}

export interface QuotationItemRequest {
  laborId: string | null;
  materialId: string | null;
  weight: number;
  note: string;
}

export interface FinalQuotationItemRequest {
  constructionId: string;
  subconstructionId: string | null;
  quotationItems: QuotationItemRequest[];
}

export interface FinalQuotationRequest {
  projectId: string;
  promotionId: string | null;
  note: string;
  batchPaymentInfos: BatchPaymentInfoRequest[];
  equipmentItems: EquipmentItemRequest[];
  utilities: UtilityRequest[];
  finalQuotationItems: FinalQuotationItemRequest[];
}
