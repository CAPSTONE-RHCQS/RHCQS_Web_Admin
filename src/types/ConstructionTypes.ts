export interface SubConstructionRequest {
  id: string;
  name: string;
  coefficient: number;
  unit: string;
}

export interface ConstructionRequest {
  name: string;
  coefficient: number;
  unit: string;
  type: string;
  subRequests: SubConstructionRequest[];
}

export interface ContractConstructionRequest {
  projectId: string;
  startDate: string;
  endDate: string;
  validityPeriod: number;
  taxCode: string;
  contractValue: number;
  urlFile: string;
  note: string;
}

export interface ConstructionContractRequest {
  projectId: string;
  startDate: string;
  endDate: string;
  validityPeriod: number;
  taxCode: string;
  contractValue: number;
  urlFile: string | null;
  note: string;
}

export interface ConstructionSearchResponse {
  Id: string;
  SubConstructionId: string;
  Name: string;
  Coefficient: number;
}

export interface ConstructionWork {
  WorkTemplateId: string;
  Unit: string;
  ConstructionWorkId: string;
  ConstructionWorkName: string;
  LaborCost: number;
  MaterialRoughCost: number;
  MaterialFinishedCost: number;
}
