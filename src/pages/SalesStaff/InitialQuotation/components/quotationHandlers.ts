import {
  InitialQuotationResponse,
  UpdateInitialQuotationRequest,
  QuotationUtility,
} from '../../../../types/InitialQuotationTypes';
import {
  getInitialQuotation,
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
  id: string | undefined,
  setQuotationData: React.Dispatch<
    React.SetStateAction<InitialQuotationResponse | null>
  >,
  setVersion: React.Dispatch<React.SetStateAction<number | null>>,
  setTableData: React.Dispatch<React.SetStateAction<TableRow[]>>,
  setGiaTriHopDong: React.Dispatch<React.SetStateAction<number>>,
  setPaymentSchedule: React.Dispatch<React.SetStateAction<any[]>>,
  setUtilityInfos: React.Dispatch<React.SetStateAction<QuotationUtility[]>>,
  setDonGia: React.Dispatch<React.SetStateAction<number>>,
  setPromotionInfo: React.Dispatch<React.SetStateAction<any>>,
) => {
  if (id) {
    try {
      const data: InitialQuotationResponse = await getInitialQuotation(id);
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
        const discountValue = giaTriHopDong * (data.PromotionInfo.Value / 100);
        giaTriHopDong -= discountValue;
        setPromotionInfo(data.PromotionInfo);
      }

      setGiaTriHopDong(giaTriHopDong);
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
  paymentSchedule: any[],
  utilityInfos: QuotationUtility[],
  promotionInfo: any,
  navigate: (path: string) => void,
  setIsSaving: (value: boolean) => void,
) => {
  if (!quotationData) return;

  const hasEmptyFields = tableData.some(
    (item) => item.dTich.trim() === '' || item.hangMuc.trim() === '',
  );

  if (hasEmptyFields) {
    toast.error('Vui lòng điền đầy đủ D-Tích và Tên hạng mục trước khi lưu.');
    return;
  }

  const requestData: UpdateInitialQuotationRequest = {
    versionPresent: version || 1,
    accountName: quotationData.AccountName,
    address: quotationData.Address,
    projectId: quotationData.ProjectId,
    area: quotationData.Area,
    timeProcessing: parseInt(quotationData.TimeProcessing || '0', 10),
    timeRough: 0,
    timeOthers: parseInt(quotationData.TimeOthers || '0', 10),
    othersAgreement: quotationData.OthersAgreement || '',
    totalRough: quotationData.TotalRough,
    totalUtilities: quotationData.TotalUtilities,
    items: tableData.map((item) => {
      return {
        name: item.hangMuc,
        constructionItemId: item.constructionItemId || 'default-id',
        subConstructionId: item.subConstructionId ?? null,
        area: parseFloat(item.dTich),
        price: 0,
      };
    }),
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
    promotions:
      promotionInfo &&
      promotionInfo.Id !== '00000000-0000-0000-0000-000000000000'
        ? { id: promotionInfo.Id }
        : null,
    batchPayments: paymentSchedule.map((payment) => ({
      price: payment.Price,
      percents: payment.Percents,
      description: payment.Description,
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
