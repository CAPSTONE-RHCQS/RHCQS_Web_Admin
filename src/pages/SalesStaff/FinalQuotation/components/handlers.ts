import { FinalQuotationDetail as FinalQuotationDetailType } from '../../../../types/FinalQuotationTypes';
import { FinalQuotationRequest } from '../../../../types/FinalQuotationRequestTypes';
import { updateFinalQuotation } from '../../../../api/FinalQuotation/FinalQuotationApi';
import { toast } from 'react-toastify';
import axios from 'axios';

export const handleSeva = async (
  quotationDetail: FinalQuotationDetailType | null,
  totalContractValue: number,
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
      promotionId: quotationDetail.PromotionInfo?.Id || '',
      note: quotationDetail.Note || '',
      versionPresent: quotationDetail.Version || 1,
      batchPaymentInfos: quotationDetail.BatchPaymentInfos.map((payment) => ({
        price: totalContractValue * (payment.Percents / 100),
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
        coefficient: util.Coefficient,
        price: util.Price,
        description: util.Description,
        quantity: util.Quantity || null,
      })),
      finalQuotationItems: quotationDetail.FinalQuotationItems.map((item) => ({
        constructionId: item.ConstructionId,
        subconstructionId: item.SubConstructionId || null,
        quotationItems: item.QuotationItems.map((qItem) => ({
          workTemplateId: qItem.WorkTemplateId || '',
          unit: qItem.Unit,
          weight: qItem.Weight ?? 0,
          unitPriceLabor: qItem.UnitPriceLabor ?? 0,
          unitPriceRough: qItem.UnitPriceRough ?? 0,
          unitPriceFinished: qItem.UnitPriceFinished ?? 0,
          totalPriceLabor: qItem.TotalPriceLabor ?? 0,
          totalPriceRough: qItem.TotalPriceRough ?? 0,
          totalPriceFinished: qItem.TotalPriceFinished ?? 0,
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
  totalContractValue: number,
  setIsSaving: (value: boolean) => void,
  navigate: (path: string) => void,
) => {
  if (!quotationDetail) {
    toast.error('Dữ liệu báo giá không hợp lệ.');
    return false;
  }

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
    promotionId: quotationDetail.PromotionInfo?.Id || '',
    note: quotationDetail.Note || '',
    versionPresent: 0,
    batchPaymentInfos: quotationDetail.BatchPaymentInfos.map((payment) => ({
      price: totalContractValue * (payment.Percents / 100),
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
      coefficient: util.Coefficient,
      price: util.Price,
      description: util.Description,
      quantity: util.Quantity || null,
    })),
    finalQuotationItems: quotationDetail.FinalQuotationItems.map((item) => ({
      constructionId: item.ConstructionId,
      promotionId: quotationDetail.PromotionInfo?.Id || '',
      subconstructionId: item.SubConstructionId || null,
      quotationItems: item.QuotationItems.map((qItem) => ({
        workTemplateId: qItem.WorkTemplateId || '',
        unit: qItem.Unit,
        weight: qItem.Weight ?? 0,
        unitPriceLabor: qItem.UnitPriceLabor ?? 0,
        unitPriceRough: qItem.UnitPriceRough ?? 0,
        unitPriceFinished: qItem.UnitPriceFinished ?? 0,
        totalPriceLabor: qItem.TotalPriceLabor ?? 0,
        totalPriceRough: qItem.TotalPriceRough ?? 0,
        totalPriceFinished: qItem.TotalPriceFinished ?? 0,
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
    console.error('Lỗi khi khởi tạo báo giá:', error);
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && error.response.data.Error) {
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
};

export const handleEditToggle = (
  isEditing: boolean,
  setIsEditing: (value: boolean) => void,
) => {
  setIsEditing(!isEditing);
};
