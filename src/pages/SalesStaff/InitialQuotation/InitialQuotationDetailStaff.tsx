import React, { useState, useEffect } from 'react';
import { FaDownload, FaShareAlt, FaCommentDots } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InitialQuotationStatusTracker from '../../../components/StatusTracker/InitialQuotationStatusTracker';
import ConstructionAreaTable from '../components/Table/ConstructionAreaTable';
import { getStatusLabelInitalQuoteDetail } from '../../../utils/utils';
import { formatCurrencyShort } from '../../../utils/format';

import {
  InitialQuotationResponse,
  UpdateInitialQuotationRequest,
} from '../../../types/InitialQuotationTypes';
import {
  getInitialQuotation,
  updateInitialQuotation,
} from '../../../api/InitialQuotation/InitialQuotationApi';

interface TableRow {
  stt: number;
  hangMuc: string;
  dTich: string;
  heSo: string;
  dienTich: string;
  donVi: string;
  uniqueId?: string;
  constructionItemId?: string;
  subConstructionId?: string | null;
}

interface OptionRow {
  stt: number;
  hangMuc: string;
  soLuong: number;
  heSo: number;
  thanhTien: number;
}

const InitialQuotationDetailStaff = () => {
  const { id } = useParams<{ id: string }>();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [giaTriHopDong, setGiaTriHopDong] = useState<number>(0);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [optionData, setOptionData] = useState<OptionRow[]>([]);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<any[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [donGia, setDonGia] = useState<number>(0);
  const [version, setVersion] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuotationData = async () => {
      if (id) {
        try {
          const data: InitialQuotationResponse = await getInitialQuotation(id);
          console.log('Fetched Quotation Data:', data);
          setQuotationData(data);
          setVersion(data.Version || null);

          const comboDonGia =
            data.PackageQuotationList.UnitPackageFinished || 0;

          const updatedTableData = data.ItemInitial.map((item, index) => {
            const coefficient =
              item.Coefficient !== 0
                ? item.Coefficient
                : item.SubCoefficient || 0;
            return {
              stt: index + 1,
              hangMuc: item.Name,
              dTich: item.Area.toString(),
              heSo: coefficient.toString(),
              dienTich: (item.Area * coefficient).toString(),
              donVi: 'm²',
              uniqueId: item.Id,
              constructionItemId: item.ConstructionItemId,
              subConstructionId: item.SubConstructionId ?? null,
            };
          });
          setTableData(updatedTableData);

          const totalRough = data.TotalRough;
          const totalUtilities = data.TotalUtilities;
          const totalUtilityCost = data.UtilityInfos.reduce(
            (total, utility) => total + utility.Price,
            0,
          );

          let giaTriHopDong = totalRough + totalUtilities + comboDonGia;

          if (data.PromotionInfo) {
            const discountValue =
              giaTriHopDong * (data.PromotionInfo.Value / 100);
            giaTriHopDong -= discountValue;
            setPromotionInfo(data.PromotionInfo);
          }

          setGiaTriHopDong(giaTriHopDong);
          setPaymentSchedule(data.BatchPaymentInfos);
          setUtilityInfos(data.UtilityInfos);
          setDonGia(data.PackageQuotationList.UnitPackageRough);
        } catch (error) {
          console.error('Error fetching quotation data:', error);
        }
      }
    };

    fetchQuotationData();
  }, [id]);

  if (!quotationData) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof TableRow,
  ) => {
    const newData = [...tableData];
    newData[index] = { ...newData[index], [field]: e.target.value };

    if (field === 'dTich') {
      if (e.target.value.trim() === '') {
        toast.error('D-Tích không được để trống');
        return;
      }
      newData[index].dienTich = (
        parseFloat(newData[index].dTich) * parseFloat(newData[index].heSo)
      ).toString();
    }

    setTableData(newData);
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof OptionRow,
  ) => {
    const newData = [...optionData];
    newData[index] = { ...newData[index], [field]: parseFloat(e.target.value) };

    if (field === 'soLuong' || field === 'heSo') {
      newData[index].thanhTien =
        newData[index].soLuong * newData[index].heSo * thanhTien;
    }

    setOptionData(newData);
  };

  const totalDienTich = tableData.reduce((total, row) => {
    const dienTich = parseFloat(row.dienTich);
    return total + (isNaN(dienTich) ? 0 : dienTich);
  }, 0);

  const thanhTien = totalDienTich * donGia;

  const handleDownload = () => {
    toast.info('Tải về hợp đồng');
  };

  const handleShare = () => {
    toast.info('Chia sẻ hợp đồng');
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const totalPercentage = paymentSchedule.reduce(
    (total, row) => total + parseFloat(row.Percents),
    0,
  );
  const totalAmount = paymentSchedule.reduce(
    (total, row) => total + row.Price,
    0,
  );

  const totalUtilityCost = utilityInfos.reduce(
    (total, utility) => total + utility.Price,
    0,
  );

  const handleSave = async () => {
    if (!quotationData) return;

    const hasEmptyDich = tableData.some((item) => item.dTich.trim() === '');
    if (hasEmptyDich) {
      toast.error('Vui lòng điền đầy đủ D-Tích trước khi lưu.');
      return;
    }

    console.log('Data to be sent:', tableData);

    const requestData: UpdateInitialQuotationRequest = {
      versionPresent: version || 1,
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
        {
          packageId: quotationData.PackageQuotationList.IdPackageRough,
          type: 'ROUGH',
        },
        {
          packageId: quotationData.PackageQuotationList.IdPackageFinished,
          type: 'FINISHED',
        },
      ],
      utilities: utilityInfos.map((utility) => ({
        utilitiesItemId: utility.Id,
        coefiicient: utility.Coefficient,
        price: utility.Price,
        description: utility.Description,
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
      await updateInitialQuotation(requestData);
      toast.success('Dữ liệu đã được lưu thành công!');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Có lỗi xảy ra khi lưu dữ liệu.');
    }
  };

  const addNewRow = () => {
    const newRow: TableRow = {
      stt: tableData.length + 1,
      hangMuc: '',
      dTich: '',
      heSo: '',
      dienTich: '',
      donVi: 'm²',
      uniqueId: undefined,
      constructionItemId: undefined,
      subConstructionId: undefined,
    };
    setTableData([...tableData, newRow]);
  };

  return (
    <>
      <ToastContainer />
      <div>
        {!showChat && (
          <button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <FaCommentDots className="text-2xl" />
          </button>
        )}

        <InitialQuotationStatusTracker
          currentStatus={getStatusLabelInitalQuoteDetail(quotationData.Status)}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          {isEditing ? 'Lưu' : 'Chỉnh sửa'}
        </button>
        <button
          onClick={handleDownload}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          <FaDownload className="text-lg" />
        </button>

        <button
          onClick={handleShare}
          className="border-primary hover:bg-opacity-90 px-4 py-2 rounded font-medium text-primary flex items-center"
        >
          <FaShareAlt className="text-lg" />
        </button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Thông tin báo giá sơ bộ</h2>
          <div className="text-right">
            <span className="font-semibold">Phiên bản:</span>
            <span className="text-gray-700 ml-2">{quotationData.Version}</span>
            <div className="text-gray-500 text-sm">
              Tạo lúc {new Date(quotationData.InsDate).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="mt-4 mb-4 text-lg">
            <strong>Diện tích xây dựng theo phương án thiết kế:</strong>
          </p>
          <button
            onClick={addNewRow}
            className="bg-blue-500 text-white px-2 py-1 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-200"
          >
            +
          </button>
        </div>

        <ConstructionAreaTable
          tableData={tableData}
          isEditing={isEditing}
          handleInputChange={handleInputChange}
          totalDienTich={totalDienTich}
          setTableData={setTableData}
        />

        <p className="text-lg mb-4">
          <strong>Giá trị báo giá sơ bộ xây dựng trước thuế:</strong>
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">
                  Tổng diện tch xây dựng
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
                  {totalDienTich} m²
                </td>
                <td className="px-4 py-2 border text-center">x</td>
                <td className="px-4 py-2 border text-center">
                  {donGia.toLocaleString()} đồng/m²
                </td>
                <td className="px-4 py-2 border text-center">=</td>
                <td className="px-4 py-2 border text-center">
                  <strong> {thanhTien.toLocaleString()} đồng</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-lg mb-4">
          <strong>2. TÙY CHỌN & TIỆN ÍCH:</strong>
        </p>
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
              {utilityInfos.map((utility) => (
                <tr key={utility.Id}>
                  <td className="px-4 py-2 border text-left">
                    {utility.Description}
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

        <p className="text-lg mb-4">
          <strong>3. KHUYẾN MÃI:</strong>
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Tên khuyến mãi</th>
                <th className="px-4 py-2 border text-center">Giá trị (%)</th>
              </tr>
            </thead>
            <tbody>
              {promotionInfo ? (
                <tr>
                  <td className="px-4 py-2 border text-left">
                    {promotionInfo.Name}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {promotionInfo.Value}%
                  </td>
                </tr>
              ) : (
                <tr>
                  <td className="px-4 py-2 border text-center" colSpan={2}>
                    Không có khuyến mãi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <p className="text-lg">
            <strong>4. CÁC THỎA THUẬN KHÁC:</strong>
          </p>
          <p className="text-gray-700 whitespace-pre-line">
            {quotationData.OthersAgreement}
          </p>
        </div>

        <p className="text-lg mb-4">
          <strong>5. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:</strong>
        </p>
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
                    -
                    {(
                      giaTriHopDong *
                      (promotionInfo.Value / 100)
                    ).toLocaleString()}{' '}
                    VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">VNĐ</td>
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

        <p className="text-lg mb-4">
          <strong>6. CÁC ĐT THANH TOÁN:</strong>
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th
                  className="px-4 py-2 border text-center"
                  style={{ width: '10%' }}
                >
                  Đợt
                </th>
                <th className="px-4 py-2 border text-left">Nội dung</th>
                <th className="px-4 py-2 border text-center">T-Toán (%)</th>
                <th className="px-4 py-2 border text-center">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {paymentSchedule.map((row, index) => (
                <tr key={row.Id}>
                  <td
                    className="px-4 py-2 border text-center"
                    style={{ width: '10%' }}
                  >
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border text-left">
                    {row.Description}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.Percents}%
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {row.Price.toLocaleString()} {row.Unit}
                  </td>
                </tr>
              ))}
              <tr>
                <td className="px-4 py-2 border text-center" colSpan={2}>
                  <strong>Tổng giá trị hợp đồng</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalPercentage}%</strong>
                </td>
                <td className="px-4 py-2 border text-center">
                  <strong>{totalAmount.toLocaleString()} VNĐ</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InitialQuotationDetailStaff;
