import { EquipmentItem as FinalEquipmentItem } from '../types/FinalQuotationTypes';
import { EquipmentItem as ApiEquipmentItem } from '../types/EquipmentTypes';

export const convertApiResponseToFinalEquipmentItem = (
  apiItems: ApiEquipmentItem[],
): FinalEquipmentItem[] => {
  return apiItems.map((apiItem) => ({
    Id: apiItem.STT,
    Name: apiItem.Name,
    Unit: apiItem.Unit,
    Quantity: apiItem.Quantity,
    UnitOfMaterial: apiItem.UnitOfMaterial,
    TotalOfMaterial: apiItem.TotalOfMaterial,
    Note: apiItem.Note || null,
    Type: apiItem.Type,
  }));
};
