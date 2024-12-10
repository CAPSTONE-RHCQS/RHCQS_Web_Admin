export interface UtilityItem {
  Id: string;
  Name: string;
  Type: string;
  Deflag: boolean;
  InsDate: string;
  UpsDate: string;
  Sections: SectionItem[];
}

export interface SectionItem {
  Id: string;
  Name: string;
  Deflag: boolean;
  InsDate: string;
  UpsDate: string;
  Description: string | null;
  UnitPrice: number | null;
  Unit: string | null;
  Items: Item[];
}

export interface Item {
  Id: string;
  SectionId: string;
  Name: string;
  Coefficient: number;
  InsDate: string;
  UpsDate: string;
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
  name: string | null;
  type: string | null;
  sections: SectionRequest[];
  items: ItemRequest[] | null;
}
