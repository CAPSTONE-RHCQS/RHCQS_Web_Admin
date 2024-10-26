export interface SectionItem {
  Id: string;
  Name: string;
  Deflag: boolean;
  InsDate: string;
  UpsDate: string;
  Description: string | null;
  UnitPrice: number | null;
  Unit: string | null;
  Items: any | null;
}

export interface UtilityItem {
  Id: string | null;
  Name: string;
  Type: string;
  Deflag: boolean;
  InsDate: string;
  UpsDate: string;
  Sections: SectionItem[];
  Items: Item[];
}

export interface Item {
  Name: string;
  Coefficient: number;
}

export interface SectionRequest {
  id: string | null;
  name: string;
  description: string;
  unitPrice: number;
  unit: string;
}

export interface ItemRequest {
  name: string;
  coefficient: number;
}

export interface UtilityRequest {
  id: string | null;
  name: string;
  type: string;
  sections: SectionRequest[];
  items: ItemRequest[];
}
