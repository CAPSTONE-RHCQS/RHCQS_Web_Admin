export interface EquipmentItem {
  STT: string;
  Code: string;
  Name: string;
  Unit: string;
  Quantity: number;
  UnitOfMaterial: number;
  TotalOfMaterial: number;
  Note: string;
  Type: string;
}

export type EquipmentResponse = EquipmentItem[];
