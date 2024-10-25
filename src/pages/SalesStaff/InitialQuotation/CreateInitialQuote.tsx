import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createNewInitialQuotation,
  updateInitialQuotation,
} from '../../../api/Project/InitialQuotationApi';
import {
  InitialQuotationResponse,
  UpdateInitialQuotationRequest,
} from '../../../types/InitialQuotationTypes';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import ConstructionAreaTable from '../components/Table/ConstructionAreaTable';

const CreateInitialQuote = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([
    {
      price: 0,
      percents: '',
      description: '',
      paymentDate: '',
      paymentPhase: '',
    },
  ]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);

  useEffect(() => {
    const fetchQuotationData = async () => {
      if (projectId) {
        try {
          const data = await createNewInitialQuotation(projectId);
          setQuotationData(data);
        } catch (error) {
          console.error('Error fetching initial quotation:', error);
        }
      }
    };
    fetchQuotationData();
  }, [projectId]);

  if (!quotationData) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  const convertToTableRow = (item: any, index: number) => ({
    stt: index + 1,
    hangMuc: item.Name,
    dTich: item.Area.toString(),
    heSo: item.SubCoefficient.toString(),
    dienTich: (item.Area * item.SubCoefficient).toString(),
    donVi: item.UnitPrice,
  });

  const tableData = quotationData.ItemInitial.map(convertToTableRow);
  const totalDienTich = tableData.reduce(
    (total, row) => total + parseFloat(row.dienTich),
    0,
  );
  const donGia = quotationData.PackageQuotationList.UnitPackageRough;
  const thanhTien = totalDienTich * donGia;
  const totalUtilityCost = quotationData.UtilityInfos.reduce(
    (total, utility) => total + utility.Price,
    0,
  );
  const giaTriHopDong =
    thanhTien +
    totalUtilityCost -
    (promotionInfo
      ? (thanhTien + totalUtilityCost) * (promotionInfo.Value / 100)
      : 0);

  const handlePaymentScheduleChange = (
    index: number,
    field: string,
    value: any,
  ) => {
    const newSchedule = [...paymentSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setPaymentSchedule(newSchedule);
  };

  const addPaymentSchedule = () => {
    setPaymentSchedule([
      ...paymentSchedule,
      {
        price: 0,
        percents: '',
        description: '',
        paymentDate: '',
        paymentPhase: '',
      },
    ]);
  };

  const removePaymentSchedule = (index: number) => {
    const newSchedule = paymentSchedule.filter((_, i) => i !== index);
    setPaymentSchedule(newSchedule);
  };

  const handlePromotionChange = (field: string, value: any) => {
    setPromotionInfo({ ...promotionInfo, [field]: value });
  };

  const handleCreateInitialQuote = async () => {
    if (!quotationData) return;

    const requestData: UpdateInitialQuotationRequest = {
      versionPresent: 0,
      projectId: quotationData.ProjectId,
      area: quotationData.Area,
      timeProcessing: 0,
      timeRough: 0,
      timeOthers: 0,
      othersAgreement: '',
      totalRough: thanhTien,
      totalUtilities: totalUtilityCost,
      items: quotationData.ItemInitial.map((item) => ({
        name: item.Name,
        constructionItemId: item.ConstructionItemId,
        subConstructionId: item.SubConstructionId,
        area: item.Area,
        price: item.Price,
      })),
      packages: [],
      utilities: quotationData.UtilityInfos.map((utility) => ({
        utilitiesItemId: utility.Id,
        coefiicient: utility.Coefficient,
        price: utility.Price,
        description: utility.Description,
      })),
      promotions: promotionInfo ? { id: promotionInfo.Id } : null,
      batchPayments: paymentSchedule.map((payment) => ({
        price: payment.price,
        percents: payment.percents,
        description: payment.description,
      })),
    };

    try {
      await updateInitialQuotation(requestData);
      toast.success('Khởi tạo báo giá sơ bộ thành công!');
      navigate(`/project-detail-staff/${quotationData.ProjectId}`);
    } catch (error) {
      console.error('Failed to create initial quotation:', error);
      toast.error('Khởi tạo báo giá sơ bộ thất bại!');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Khởi tạo báo giá sơ bộ</h2>
      <div className="mb-4">
        <p className="text-lg">
          <strong>1. ĐƠN GIÁ THI CÔNG</strong>
        </p>
        <p className="mb-2">
          {quotationData.PackageQuotationList.PackageRough} -{' '}
          {quotationData.PackageQuotationList.UnitPackageRough.toLocaleString()}{' '}
          đồng/m²
        </p>
        {quotationData.PackageQuotationList.PackageFinished &&
          quotationData.PackageQuotationList.UnitPackageFinished !== 0 && (
            <p className="mb-2">
              {quotationData.PackageQuotationList.PackageFinished} -{' '}
              {quotationData.PackageQuotationList.UnitPackageFinished.toLocaleString()}{' '}
              đồng/m²
            </p>
          )}
      </div>

      <ConstructionAreaTable
        tableData={tableData}
        isEditing={true}
        handleInputChange={() => {}}
        totalDienTich={totalDienTich}
      />

      <div className="mt-4">
        <h3 className="text-lg font-bold">
          2. GIÁ TRỊ BÁO GIÁ SƠ BỘ XÂY DỰNG TRƯỚC THUẾ:
        </h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">
                  Tổng diện tích xây dựng
                </th>
                <th className="px-4 py-2 border text-center">x</th>
                <th className="px-4 py-2 border text-center">Đơn giá</th>
                <th className="px-4 py-2 border text-center">=</th>
                <th className="px-4 py-2 border text-center">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">
                  {totalDienTich.toLocaleString()} m²
                </td>
                <td className="px-4 py-2 border text-center">x</td>
                <td className="px-4 py-2 border text-center">
                  {donGia.toLocaleString()} đồng/m²
                </td>
                <td className="px-4 py-2 border text-center">=</td>
                <td className="px-4 py-2 border text-center">
                  {thanhTien.toLocaleString()} đồng
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">3. TÙY CHỌN & TIỆN ÍCH:</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Hệ số</th>
                <th className="px-4 py-2 border text-center">Giá</th>
              </tr>
            </thead>
            <tbody>
              {quotationData.UtilityInfos.map((utility) => (
                <tr key={utility.Id}>
                  <td className="px-4 py-2 border text-left">
                    {utility.Description || ''}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.Coefficient}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {utility.Price.toLocaleString()} VNĐ
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={2}>
                  <strong>Tổng chi phí tiện ích</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalUtilityCost.toLocaleString()} VNĐ</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">4. KHUYẾN MÃI:</h3>
        <input
          type="text"
          placeholder="Tên khuyến mãi"
          value={promotionInfo?.Name || ''}
          onChange={(e) => handlePromotionChange('Name', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Giá trị (%)"
          value={promotionInfo?.Value || ''}
          onChange={(e) => handlePromotionChange('Value', e.target.value)}
          className="w-full p-2 border rounded mt-2"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">5. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Giá trị</th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-left">
                  Phần Thô Tiết Kiệm
                </td>
                <td className="px-4 py-2 border text-center">
                  {thanhTien.toLocaleString()} VNĐ
                </td>
                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
              <tr>
                <td className="px-4 py-2 border text-left">
                  Tùy chọn & Tiện ích
                </td>
                <td className="px-4 py-2 border text-center">
                  {totalUtilityCost.toLocaleString()} VNĐ
                </td>
                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
              {promotionInfo && (
                <tr>
                  <td className="px-4 py-2 border text-left">
                    Khuyến mãi ({promotionInfo.Name})
                  </td>
                  <td className="px-4 py-2 border text-center">
                    -{promotionInfo.Value}%
                  </td>
                  <td className="px-4 py-2 border text-center">%</td>
                </tr>
              )}
              <tr>
                <td className="px-4 py-2 border text-center">
                  <strong>GIÁ TRỊ HỢP ĐỒNG</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{giaTriHopDong.toLocaleString()} VNĐ</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>VNĐ</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">6. CÁC ĐỢT THANH TOÁN:</h3>
        {paymentSchedule.map((payment, index) => (
          <div
            key={index}
            className="flex flex-wrap md:flex-nowrap gap-4 mb-4 items-center"
          >
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">
                Giá trị thanh toán (VNĐ):
              </label>
              <input
                type="number"
                value={payment.price}
                onChange={(e) =>
                  handlePaymentScheduleChange(
                    index,
                    'price',
                    parseFloat(e.target.value),
                  )
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">
                Phần trăm:
              </label>
              <input
                type="text"
                value={payment.percents}
                onChange={(e) =>
                  handlePaymentScheduleChange(index, 'percents', e.target.value)
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-lg font-medium mb-2">Mô tả:</label>
              <input
                type="text"
                value={payment.description}
                onChange={(e) =>
                  handlePaymentScheduleChange(
                    index,
                    'description',
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => removePaymentSchedule(index)}
              className="text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPaymentSchedule}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 mt-2"
        >
          Thêm đợt thanh toán
        </button>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleCreateInitialQuote}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md"
        >
          Khởi tạo báo giá sơ bộ
        </button>
      </div>
    </div>
  );
};

export default CreateInitialQuote;
