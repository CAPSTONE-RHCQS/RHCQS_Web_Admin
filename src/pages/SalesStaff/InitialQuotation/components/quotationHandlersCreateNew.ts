import {
  InitialQuotationResponse,
  UpdateInitialQuotationRequest,
  QuotationUtility,
  PromotionInfo,
  BatchPaymentInfo,
} from '../../../../types/InitialQuotationTypes';
import {
  createNewInitialQuotation,
  updateInitialQuotation,
} from '../../../../api/InitialQuotation/InitialQuotationApi';
import { toast } from 'react-toastify';
import { TableRow } from './types';

const convertToQuotationUtility = (utility: any): QuotationUtility => {
  return {
    utilitiesItemId: utility.Id,
    coefficient: utility.Coefficient,
    price: utility.Price,
    description: utility.Description,
  };
};

export const fetchQuotationData = async (
  projectId: string | undefined,
  setQuotationData: React.Dispatch<
    React.SetStateAction<InitialQuotationResponse | null>
  >,
  setVersion: React.Dispatch<React.SetStateAction<number | null>>,
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>,
  setPaymentSchedule: React.Dispatch<React.SetStateAction<BatchPaymentInfo[]>>,
  setUtilityInfos: React.Dispatch<React.SetStateAction<QuotationUtility[]>>,
  setDonGia: React.Dispatch<React.SetStateAction<number>>,
  setPromotionInfo: React.Dispatch<React.SetStateAction<any>>,
) => {
  if (projectId) {
    try {
      const data: InitialQuotationResponse = await createNewInitialQuotation(
        projectId,
      );
      console.log('Fetched Quotation Data:', data);
      setQuotationData(data);
      setVersion(data.Version || null);

      const updatedTableData = data.ItemInitial.map((item, index) => {
        const coefficient =
          item.Coefficient !== 0 ? item.Coefficient : item.SubCoefficient || 0;
        return {
          stt: index + 1,
          hangMuc: item.SubConstruction || item.Name,
          dTich: item.Area.toString(),
          heSo: coefficient.toString(),
          dienTich: (item.Area * coefficient).toString(),
          donVi: 'm²',
          price: item.Price,
          uniqueId: item.Id,
          constructionItemId: item.ConstructionItemId,
          subConstructionId: item.SubConstructionId ?? null,
        };
      });
      setTableData(updatedTableData);

      const totalRough = data.TotalRough;
      const totalUtilities = data.TotalUtilities;
      let giaTriHopDong = totalRough + totalUtilities;

      if (data.PromotionInfo) {
        const discountValue = data.PromotionInfo.Value || 0;
        giaTriHopDong -= discountValue;
        setPromotionInfo(data.PromotionInfo);
      }

      setPaymentSchedule(data.BatchPaymentInfos);
      setUtilityInfos(data.UtilityInfos.map(convertToQuotationUtility));
      setDonGia(data.PackageQuotationList.UnitPackageRough);
    } catch (error) {
      console.error('Error fetching quotation data:', error);
    }
  }
};

export const handleSave = async (
  quotationData: InitialQuotationResponse | null,
  tableData: TableRow[],
  version: number | null,
  paymentSchedule: BatchPaymentInfo[],
  utilityInfos: QuotationUtility[],
  promotionInfo: PromotionInfo | null,
  giaTriHopDong: number,
  navigate: (path: string) => void,
  setIsSaving: (value: boolean) => void,
  othersAgreement: string,
) => {
  if (!quotationData) return;

  const hasEmptyFields = tableData.some(
    (item) => item.dTich.trim() === '' || item.hangMuc.trim() === '',
  );

  if (hasEmptyFields) {
    toast.error('Vui lòng điền đầy đủ D-Tích và Tên hạng mục trước khi lưu.');
    return;
  }

  const hasEmptyPaymentFields = paymentSchedule.some(
    (payment) =>
      payment.Description.trim() === '' ||
      (typeof payment.Percents === 'number' && payment.Percents === 0) ||
      !payment.PaymentDate ||
      !payment.PaymentPhase,
  );

  if (hasEmptyPaymentFields) {
    toast.error('Các đợt thanh toán không được để trống.');
    return;
  }

  if (paymentSchedule.length === 0) {
    toast.error('Các đợt thanh toán không được để trống.');
    return;
  }

  // const hasEmptyUtilityFields = utilityInfos.some(
  //   (utility) =>
  //     utility.description.trim() === '' ||
  //     utility.coefficient === 0 ||
  //     utility.price === 0,
  // );

  // if (hasEmptyUtilityFields) {
  //   toast.error('Các trường tiện ích không được để trống.');
  //   return;
  // }

  const isInvalidPromotion =
    !promotionInfo ||
    promotionInfo.Id === '00000000-0000-0000-0000-000000000000' ||
    promotionInfo.Value === 0;

  const requestData: UpdateInitialQuotationRequest = {
    accountName: quotationData.AccountName,
    address: quotationData.Address,
    versionPresent: version || 1,
    projectId: quotationData.ProjectId,
    isSave: true,
    area: quotationData.Area,
    timeProcessing: quotationData.TimeProcessing,
    timeRough: quotationData.TimeRough,
    timeOthers: quotationData.TimeOthers,
    othersAgreement: othersAgreement,
    totalRough: quotationData.TotalRough,
    totalUtilities: quotationData.TotalUtilities,
    items: tableData.map((item) => ({
      name: item.hangMuc,
      constructionItemId: item.constructionItemId || 'default-id',
      subConstructionId: item.subConstructionId ?? null,
      area: parseFloat(item.dTich),
      price: item.price || 0,
    })),
    packages: [
      ...(quotationData.PackageQuotationList.IdPackageRough
        ? [
            {
              packageId: quotationData.PackageQuotationList.IdPackageRough,
              type: 'ROUGH',
            },
          ]
        : []),
      ...(quotationData.PackageQuotationList.IdPackageFinished
        ? [
            {
              packageId: quotationData.PackageQuotationList.IdPackageFinished,
              type: 'FINISHED',
            },
          ]
        : []),
    ],
    utilities: utilityInfos.map((utility) => ({
      utilitiesItemId: utility.utilitiesItemId,
      coefficient: utility.coefficient,
      price: utility.price,
      description: utility.description,
    })),
    promotions: isInvalidPromotion
      ? null
      : { id: promotionInfo.Id, discount: promotionInfo.Value || 0 },
    batchPayments: paymentSchedule.map((payment) => ({
      numberOfBatch: payment.NumberOfBatch,
      price: (parseFloat(payment.Percents) / 100) * giaTriHopDong,
      percents: parseFloat(payment.Percents),
      description: payment.Description,
      paymentDate: payment.PaymentDate || '',
      paymentPhase: payment.PaymentPhase || '',
    })),
  };

  try {
    setIsSaving(true);
    await updateInitialQuotation(requestData);
    toast.success('Dữ liệu đã được lưu thành công!');
    navigate(`/project-detail-staff/${quotationData.ProjectId}`);
  } catch (error) {
    console.error('Error saving data:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Có lỗi xảy ra khi lưu dữ liệu.';
    toast.error(errorMessage);
  } finally {
    setIsSaving(false);
  }
};
