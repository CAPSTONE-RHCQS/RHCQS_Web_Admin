export interface Construction {
  Id: string;
  SubConstructionId: string;
  Name: string;
  Price: number;
  Coefficient: number;
}

export type GetConstructionByNameResponse = Construction[];

export interface Utility {
  UtilitySectionId: string;
  UtilityItemId: string;
  Name: string;
  Coefficient: number;
  UnitPrice: number;
}

export type GetUtilityByNameResponse = Utility[];
