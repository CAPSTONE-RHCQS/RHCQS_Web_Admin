import { FinalQuotationDetail as FinalQuotationDetailType } from '../../../../types/FinalQuotationTypes';
import { FinalQuotationRequest } from '../../../../types/FinalQuotationRequestTypes';
import { updateFinalQuotation } from '../../../../api/FinalQuotation/FinalQuotationApi';
import { toast } from 'react-toastify';
import axios from 'axios';

export const handleSave = async (
  quotationDetail: FinalQuotationDetailType | null,
  setIsEditing: (value: boolean) => void,
  setIsSaving: (value: boolean) => void,
) => {
  if (quotationDetail) {
    const requestData: FinalQuotationRequest = {
      projectId: quotationDetail.ProjectId,
      promotionId: quotationDetail.PromotionInfo?.Id || null,
      note: quotationDetail.Note || '',
      batchPaymentInfos: quotationDetail.BatchPaymentInfos.map((payment) => ({
        initIntitialQuotationId: quotationDetail.InitailQuotationId,
        paymentTypeId: payment.PaymentTypeId,
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
        note: item.Note || '',
        type: item.Type,
      })),
      utilities: quotationDetail.UtilityInfos.map((util) => ({
        utilitiesItemId: util.utilitiesItemId || util.utilitiesSectionId,
        price: util.Price,
      })),
      finalQuotationItems: quotationDetail.FinalQuotationItems.map((item) => ({
        constructionId: item.ConstructionId,
        subconstructionId: item.SubConstructionId ?? null,
        quotationItems: item.QuotationItems.map((qItem) => ({
          laborId: qItem.LaborId ?? null,
          materialId: qItem.MaterialId ?? null,
          weight: qItem.Weight,
          note: qItem.Note || '',
        })),
      })),
    };

    try {
      setIsSaving(true);
      await updateFinalQuotation(requestData);
      setIsEditing(false);
      toast.success('Cập nhật báo giá thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật báo giá:', error);
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
    } finally {
      setIsSaving(false);
    }
  }
};

export const hanldCreateNew = async (
  quotationDetail: FinalQuotationDetailType | null,
  setIsEditing: (value: boolean) => void,
  setIsSaving: (value: boolean) => void,
) => {
  if (quotationDetail) {
    const requestData: FinalQuotationRequest = {
      projectId: quotationDetail.ProjectId,
      promotionId: quotationDetail.PromotionInfo?.Id || null,
      note: quotationDetail.Note || '',
      batchPaymentInfos: quotationDetail.BatchPaymentInfos.map((payment) => ({
        initIntitialQuotationId: quotationDetail.InitailQuotationId,
        paymentTypeId: payment.PaymentTypeId,
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
        note: item.Note || '',
        type: item.Type,
      })),
      utilities: quotationDetail.UtilityInfos.map((util) => ({
        utilitiesItemId: util.utilitiesItemId || util.utilitiesSectionId,
        price: util.Price,
      })),
      finalQuotationItems: quotationDetail.FinalQuotationItems.map((item) => ({
        constructionId: item.ConstructionId,
        subconstructionId: item.SubConstructionId ?? null,
        quotationItems: item.QuotationItems.map((qItem) => ({
          laborId: qItem.LaborId ?? null,
          materialId: qItem.MaterialId ?? null,
          weight: qItem.Weight,
          note: qItem.Note || '',
        })),
      })),
    };

    try {
      setIsSaving(true);
      await updateFinalQuotation(requestData);
      setIsEditing(false);
    } catch (error) {
      console.error('Lỗi khi khi khởi tạo báo giá:', error);
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
    } finally {
      setIsSaving(false);
    }
  }
};

export const handleEditToggle = (
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
) => {
  setIsEditing(!isEditing);
};
