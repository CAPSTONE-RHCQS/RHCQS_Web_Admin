import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createNewInitialQuotation,
  updateInitialQuotation,
} from '../../../api/InitialQuotation/InitialQuotationApi';
import {
  InitialQuotationResponse,
  QuotationUtility,
  UpdateInitialQuotationRequest,
  UtilityInfo,
} from '../../../types/InitialQuotationTypes';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import ConstructionAreaTable from './components/Table/ConstructionAreaTable';
import { TableRow } from './components/types';
import UtilityTable from './components/Table/UtilityTable';
import ConstructionPrice from './components/Table/ConstructionPrice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const convertToQuotationUtility = (
  utilityInfo: UtilityInfo,
): QuotationUtility => {
  return {
    utilitiesItemId: utilityInfo.Id,
    coefficient: utilityInfo.Coefficient,
    price: utilityInfo.Price,
    description: utilityInfo.Description,
  };
};

const CreateInitialQuote = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [quotationData, setQuotationData] =
    useState<InitialQuotationResponse | null>(null);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);
  const [promotionInfo, setPromotionInfo] = useState<any>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<QuotationUtility[]>([]);
  const [othersAgreement, setOthersAgreement] = useState<string>('');

  useEffect(() => {
    const fetchQuotationData = async () => {
      if (projectId) {
        try {
          const data = await createNewInitialQuotation(projectId);
          setQuotationData(data);

          const initialTableData = data.ItemInitial.map(convertToTableRow);
          setTableData(initialTableData);

          setUtilityInfos(data.UtilityInfos.map(convertToQuotationUtility));
        } catch (error) {
          console.error('Error fetching initial quotation:', error);
        }
      }
    };
    fetchQuotationData();
  }, [projectId]);

  const convertToTableRow = (item: any, index: number) => ({
    stt: index + 1,
    hangMuc: item.Name,
    dTich: item.Area.toString(),
    heSo: item.SubCoefficient ? item.SubCoefficient.toString() : '0',
    dienTich: (item.Area * (item.SubCoefficient || 1)).toString(),
    donVi: item.UnitPrice,
    price: item.Price,
    constructionItemId: item.ConstructionItemId,
    subConstructionId: item.SubConstructionId,
  });

  if (!quotationData) {
    return (
      <div>
        <ClipLoader color="#36d7b7" />
      </div>
    );
  }

  const totalDienTich = tableData.reduce(
    (total, row) => total + parseFloat(row.dienTich),
    0,
  );
  const donGia = quotationData.PackageQuotationList.UnitPackageRough;
  const thanhTien = totalDienTich * donGia;
  const totalUtilityCost = utilityInfos.reduce(
    (total, utility) => total + utility.price,
    0,
  );

  const sectionNumber = tableData.length > 0 ? 3 : 2;

  const giaTriHopDong =
    tableData.length > 0
      ? thanhTien +
        totalUtilityCost -
        (promotionInfo
          ? (thanhTien + totalUtilityCost) * (promotionInfo.Value / 100)
          : 0)
      : totalUtilityCost -
        (promotionInfo ? totalUtilityCost * (promotionInfo.Value / 100) : 0);

  const handlePaymentScheduleChange = (
    index: number,
    field: string,
    value: any,
  ) => {
    const newSchedule = [...paymentSchedule];

    if (field === 'percents') {
      const percentsValue = parseFloat(value) || 0;
      if (percentsValue > 100) return;
      newSchedule[index].price = (giaTriHopDong * percentsValue) / 100;
    }

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

    setIsButtonDisabled(true);

    const requestData: UpdateInitialQuotationRequest = {
      versionPresent: 0,
      projectId: quotationData.ProjectId,
      accountName: quotationData.AccountName,
      address: quotationData.Address,
      area: quotationData.Area,
      timeProcessing: 0,
      timeRough: 0,
      timeOthers: 0,
      othersAgreement,
      totalRough: thanhTien,
      totalUtilities: totalUtilityCost,
      items: tableData.map((row) => ({
        name: row.hangMuc,
        constructionItemId: row.constructionItemId || 'default-id',
        subConstructionId: row.subConstructionId ?? null,
        area: parseFloat(row.dTich),
        price: row.price || 0,
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
      setIsButtonDisabled(false);
    }
  };

  const addTableRow = () => {
    setTableData([
      ...tableData,
      {
        stt: tableData.length + 1,
        hangMuc: '',
        dTich: '',
        heSo: '',
        dienTich: '',
        donVi: 'm²',
        price: 0,
      },
    ]);
  };

  const addUtilityRow = () => {
    setUtilityInfos([
      ...utilityInfos,
      {
        utilitiesItemId: '',
        coefficient: 0,
        price: 0,
        description: '',
      },
    ]);
  };

  const totalPercents = Math.round(
    paymentSchedule.reduce(
      (total, payment) => total + parseFloat(payment.percents || '0'),
      0,
    ),
  );

  const totalPaymentValue = paymentSchedule.reduce(
    (total, payment) => total + payment.price,
    0,
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Khởi tạo báo giá sơ bộ
      </h2>
      <div className="flex items-center mb-4">
        <div className="mb-4">
          <p className="text-lg font-bold mb-2 text-secondary">
            1. ĐƠN GIÁ THI CÔNG:
          </p>
          <ConstructionPrice
            quotationData={quotationData}
            setQuotationData={setQuotationData}
            isEditing={true}
          />
        </div>
      </div>
      <ConstructionPrice
        quotationData={quotationData}
        setQuotationData={setQuotationData}
        isEditing={false}
      />
      {tableData.length > 0 && (
        <>
          <div className="flex items-center mb-4">
            <div className="mb-4">
              <div className="flex items-center">
                <p className="mt-4 mb-4 text-lg inline-block text-secondary">
                  <strong>Diện tích xây dựng theo phương án thiết kế:</strong>
                </p>
                <button
                  onClick={addTableRow}
                  className="bg-primaryGreenButton text-white w-10 h-10 flex items-center justify-center ml-4 rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <ConstructionAreaTable
            tableData={tableData}
            isEditing={true}
            handleInputChange={(e, index, field) => {
              const newData = [...tableData];
              newData[index] = { ...newData[index], [field]: e.target.value };

              if (field === 'dTich' || field === 'heSo') {
                const dTich = parseFloat(newData[index].dTich) || 0;
                const heSo = parseFloat(newData[index].heSo) || 0;
                newData[index].dienTich = (dTich * heSo).toString();
              }

              setTableData(newData);
            }}
            totalDienTich={totalDienTich}
            setTableData={setTableData}
          />
          <div className="mt-4">
            <h3 className="text-lg font-bold text-secondary">
              2. GIÁ TRỊ BÁO GIÁ SƠ BỘ XÂY DỰNG TRƯỚC THUẾ:
            </h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
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
                  <tr className="hover:bg-gray-50">
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
        </>
      )}

      <div className="flex items-center">
        <p className="mt-4 mb-4 text-lg inline-block text-secondary">
          <strong>{sectionNumber}. TÙY CHỌN & TIỆN ÍCH:</strong>
        </p>
        <button
          onClick={addUtilityRow}
          className="bg-primaryGreenButton text-white w-10 h-10 flex items-center justify-center ml-4 rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
        >
          +
        </button>
      </div>
      <UtilityTable
        utilityInfos={utilityInfos}
        setUtilityInfos={setUtilityInfos}
        isEditing={true}
      />
      <div className="mt-4">
        <h3 className="text-lg font-bold text-secondary">
          {sectionNumber + 1}. KHUYẾN MÃI:
        </h3>
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
        <h3 className="text-lg font-bold text-secondary">
          {sectionNumber + 2}. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:
        </h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border text-center">Mô tả</th>
                <th className="px-4 py-2 border text-center">Giá trị</th>
                <th className="px-4 py-2 border text-center">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 && (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-left">
                    Phần Thô Tiết Kiệm
                  </td>
                  <td className="px-4 py-2 border text-center">
                    {thanhTien.toLocaleString()} VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">VNĐ</td>
                </tr>
              )}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-left">
                  Tùy chọn & Tiện ích
                </td>
                <td className="px-4 py-2 border text-center">
                  {totalUtilityCost.toLocaleString()} VNĐ
                </td>
                <td className="px-4 py-2 border text-center">VNĐ</td>
              </tr>
              {promotionInfo && (
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-left">
                    Khuyến mãi ({promotionInfo.Name})
                  </td>
                  <td className="px-4 py-2 border text-center">
                    -{promotionInfo.Value}%
                  </td>
                  <td className="px-4 py-2 border text-center">%</td>
                </tr>
              )}
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">
                  <strong>TỔNG GIÁ TRỊ HỢP ĐỒNG</strong>
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
        <h3 className="text-lg font-bold text-secondary">
          {sectionNumber + 3}. CÁC THỎA THUẬN KHÁC:
        </h3>
        <textarea
          value={othersAgreement}
          onChange={(e) => setOthersAgreement(e.target.value)}
          className="w-full p-2 border rounded h-32"
          placeholder="Nhập nội dung thỏa thuận khác..."
        />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-secondary">
          {sectionNumber + 4}. CÁC ĐỢT THANH TOÁN:
        </h3>
        <div className="overflow-x-auto mb-4">
          {paymentSchedule.length === 0 ? (
            <button
              onClick={addPaymentSchedule}
              className="bg-primaryGreenButton text-white px-6 py-3 rounded-lg hover:bg-secondaryGreenButton transition-colors duration-200 shadow-md"
            >
              Thêm đợt thanh toán
            </button>
          ) : (
            <table className="min-w-full max-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border text-center">Đợt</th>
                  <th className="px-4 py-2 border text-center">Nội dung</th>
                  <th className="px-4 py-2 border text-center">
                    Phần trăm (%)
                  </th>
                  <th className="px-4 py-2 border text-center">
                    Giá trị thanh toán (VNĐ)
                  </th>
                  <th className="px-4 py-2 border text-center"></th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      {index + 1}
                    </td>
                    <td
                      className="px-4 py-2 border text-center"
                      style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
                    >
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
                        className="w-full bg-transparent text-left"
                        required
                      />
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="text"
                          value={payment.percents}
                          onChange={(e) =>
                            handlePaymentScheduleChange(
                              index,
                              'percents',
                              e.target.value,
                            )
                          }
                          className="w-7 bg-transparent text-right"
                          required
                        />
                        <span className="ml-0.5">%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 border text-center">
                      {payment.price.toLocaleString()} VNĐ
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => removePaymentSchedule(index)}
                          className="bg-red-500 text-white w-8 h-8 flex items-center justify-center shadow hover:bg-red-600 transition duration-300 rounded-full"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100">
                  <td
                    className="px-4 py-2 border text-center font-bold"
                    colSpan={2}
                  >
                    TỔNG GIÁ TRỊ HỢP ĐỒNG
                  </td>
                  <td className="px-4 py-2 border text-center font-bold">
                    {totalPercents}
                    <span className="ml-0.5">%</span>
                  </td>
                  <td className="px-4 py-2 border text-center font-bold">
                    {totalPaymentValue.toLocaleString()} VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center"></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        {paymentSchedule.length > 0 && (
          <button
            onClick={addPaymentSchedule}
            className="bg-primaryGreenButton text-white px-6 py-3 rounded-lg hover:bg-secondaryGreenButton transition-colors duration-200 shadow-md"
          >
            Thêm đợt thanh toán
          </button>
        )}
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleCreateInitialQuote}
          className="bg-primaryGreenButton text-white px-6 py-3 rounded-lg hover:bg-secondaryGreenButton transition-colors duration-200 shadow-md"
          disabled={isButtonDisabled}
        >
          Khởi tạo báo giá sơ bộ
        </button>
      </div>
    </div>
  );
};

export default CreateInitialQuote;
