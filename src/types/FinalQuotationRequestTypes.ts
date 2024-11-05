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
  totalOfMaterial: number;
  note: string;
}

export interface UtilityRequest {
  utilitiesItemId: string;
  coefficient: number;
  price: number;
}

export interface QuotationLaborRequest {
  laborId: string;
  laborPrice: number;
}

export interface QuotationMaterialRequest {
  materialId: string;
  unit: string;
  materialPrice: number;
}

export interface QuotationItemRequest {
  unit: string;
  weight: number;
  unitPriceLabor: number;
  unitPriceRough: number;
  unitPriceFinished: number;
  totalPriceLabor: number;
  totalPriceRough: number;
  totalPriceFinished: number;
  note: string;
  quotationLabors: QuotationLaborRequest | null;
  quotationMaterials: QuotationMaterialRequest | null;
}

export interface FinalQuotationItemRequest {
  constructionItemId: string;
  quotationItems: QuotationItemRequest[];
}

export interface FinalQuotationRequest {
  projectId: string;
  promotionId: string | null;
  totalPrice: number;
  note: string;
  batchPaymentInfos: BatchPaymentInfoRequest[];
  equipmentItems: EquipmentItemRequest[];
  utilities: UtilityRequest[];
  finalQuotationItems: FinalQuotationItemRequest[];
} 