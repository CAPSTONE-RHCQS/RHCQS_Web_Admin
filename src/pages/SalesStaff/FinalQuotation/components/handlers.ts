import { FinalQuotationDetail as FinalQuotationDetailType } from '../../../../types/FinalQuotationTypes';
import { FinalQuotationRequest } from '../../../../types/FinalQuotationRequestTypes';
import { updateFinalQuotation } from '../../../../api/FinalQuotation/FinalQuotationApi';
import { toast } from 'react-toastify';
import axios from 'axios';

export const handleSeva = async (
  quotationDetail: FinalQuotationDetailType | null,
  setIsEditing: (value: boolean) => void,
  setIsSaving: (value: boolean) => void,
): Promise<boolean> => {
  if (quotationDetail) {
    const hasEmptyConstruction = quotationDetail.FinalQuotationItems.some(
      (item) => item.QuotationItems.length === 0,
    );

    const hasEmptyDate = quotationDetail.BatchPaymentInfos.some(
      (payment) => !payment.PaymentDate || !payment.PaymentPhase,
    );

    if (hasEmptyConstruction) {
      toast.error('Mỗi công trình phải có ít nhất một hạng mục.');
      return false;
    }

    if (hasEmptyDate) {
      toast.error('Tất cả các trường ngày phải được điền.');
      return false;
    }

    const requestData: FinalQuotationRequest = {
      customerName: quotationDetail.AccountName,
      address: quotationDetail.ProjectAddress,
      projectId: quotationDetail.ProjectId,
      promotionId: quotationDetail.PromotionInfo?.Id || null,
      note: quotationDetail.Note || '',
      batchPaymentInfos: quotationDetail.BatchPaymentInfos.map((payment) => ({
        price: payment.Price,
        numberOfBatch: payment.NumberOfBatch,
        paymentDate: payment.PaymentDate,
        paymentPhase: payment.PaymentPhase,
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
      return true;
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
      return false;
    } finally {
      setIsSaving(false);
    }
  }
  return false;
};

export const hanldCreateNew = async (
  quotationDetail: FinalQuotationDetailType | null,
  setIsSaving: (value: boolean) => void,
  navigate: (path: string) => void,
) => {
  if (quotationDetail) {
    const hasEmptyConstruction = quotationDetail.FinalQuotationItems.some(
      (item) => item.QuotationItems.length === 0,
    );

    const hasEmptyDate = quotationDetail.BatchPaymentInfos.some(
      (payment) => !payment.PaymentDate || !payment.PaymentPhase,
    );

    if (hasEmptyConstruction) {
      toast.error('Mỗi công trình phải có ít nhất một hạng mục.');
      return;
    }

    if (hasEmptyDate) {
      toast.error('Tất cả các trường ngày phải được điền.');
      return;
    }

    const requestData: FinalQuotationRequest = {
      customerName: quotationDetail.AccountName,
      address: quotationDetail.ProjectAddress,
      projectId: quotationDetail.ProjectId,
      promotionId: quotationDetail.PromotionInfo?.Id || null,
      note: quotationDetail.Note || '',
      batchPaymentInfos: quotationDetail.BatchPaymentInfos.map((payment) => ({
        price: payment.Price,
        numberOfBatch: payment.NumberOfBatch,
        paymentDate: payment.PaymentDate,
        paymentPhase: payment.PaymentPhase,
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
      toast.success('Khởi tạo báo giá thành công!');
      navigate(`/project-detail-staff/${quotationDetail.ProjectId}`);
      return true;
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
      return false;
    } finally {
      setIsSaving(false);
    }
  }
  return false;
};

export const handleEditToggle = (
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
) => {
  setIsEditing(!isEditing);
};
