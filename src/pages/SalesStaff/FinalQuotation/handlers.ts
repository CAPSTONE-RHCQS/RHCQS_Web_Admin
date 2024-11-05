import { FinalQuotationDetail as FinalQuotationDetailType } from '../../../types/FinalQuotationTypes';
import { FinalQuotationRequest } from '../../../types/FinalQuotationRequestTypes';
import { updateFinalQuotation } from '../../../api/FinalQuotation/FinalQuotationApi';
import { toast } from 'react-toastify';
import axios from 'axios';

export const handleSave = async (
  quotationDetail: FinalQuotationDetailType | null,
  setIsEditing: (value: boolean) => void,
) => {
  if (quotationDetail) {
    const requestData: FinalQuotationRequest = {
      projectId: quotationDetail.ProjectId,
      promotionId: quotationDetail.PromotionInfo?.Id || null,
      totalPrice: quotationDetail.TotalPrice,
      note: quotationDetail.Note || '',
      batchPaymentInfos: quotationDetail.BatchPaymentInfos.map((payment) => ({
        initIntitialQuotationId: quotationDetail.InitailQuotationId,
        paymentTypeId: '2DB967C9-5928-4A1E-A9EC-5130EB179D6E',
        contractId: payment.ContractId,
        price: payment.Price,
        percents: payment.Percents,
        description: payment.Description,
        status: payment.Status,
      })),
      equipmentItems: quotationDetail.EquipmentItems.map((item) => ({
        name: item.Name,
        unit: item.Unit,
        quantity: item.Quantity,
        unitOfMaterial: item.UnitOfMaterial,
        totalOfMaterial: item.TotalOfMaterial,
        note: item.Note || '',
      })),
      utilities: quotationDetail.UtilityInfos.map((util) => ({
        utilitiesItemId: util.utilitiesItemId || util.utilitiesSectionId,
        coefficient: util.Coefficient,
        price: util.Price,
      })),
      finalQuotationItems: quotationDetail.FinalQuotationItems.map((item) => ({
        constructionItemId: item.ContructionId,
        quotationItems: item.QuotationItems.map((qItem) => ({
          unit: qItem.Unit,
          weight: qItem.Weight,
          unitPriceLabor: qItem.UnitPriceLabor || 0,
          unitPriceRough: qItem.UnitPriceRough || 0,
          unitPriceFinished: qItem.UnitPriceFinished || 0,
          totalPriceLabor: qItem.TotalPriceLabor || 0,
          totalPriceRough: qItem.TotalPriceRough || 0,
          totalPriceFinished: qItem.TotalPriceFinished || 0,
          note: qItem.Note || '',
          quotationLabors: qItem.QuotationLabors.length > 0
            ? {
                laborId: qItem.QuotationLabors[0].LaborId,
                laborPrice: qItem.QuotationLabors[0].LaborPrice,
              }
            : null,
          quotationMaterials: qItem.QuotationMaterials.length > 0
            ? {
                materialId: qItem.QuotationMaterials[0].MaterialId,
                unit: qItem.QuotationMaterials[0].Unit,
                materialPrice: qItem.QuotationMaterials[0].MaterialPrice,
              }
            : null,
        })),
      })),
    };

    try {
      await updateFinalQuotation(requestData);
      setIsEditing(false);
      toast.success('Cập nhật báo giá thành công!');
    } catch (error) {
      console.error('Error updating final quotation:', error);
      if (axios.isAxiosError(error)) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.Error
        ) {
          toast.error(`Lỗi: ${error.response.data.Error}`);
        } else {
          toast.error('Đã xảy ra lỗi khi cập nhật báo giá.');
        }
      } else {
        toast.error('Đã xảy ra lỗi không xác định.');
      }
    }
  }
};

export const handleEditToggle = (
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
) => {
  setIsEditing(!isEditing);
};
