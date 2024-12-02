export interface SubConstructionItem {
  Id: string;
  Name: string;
  Coefficient: number;
  Unit: string;
  InsDate: string;
}

export interface ConstructionTypeResponse {
  Id: string;
  Name: string;
  Coefficient: number;
  Unit: string;
  InsDate: string;
  UpsDate: string;
  Type: string;
  SubConstructionItems: SubConstructionItem[];
}
