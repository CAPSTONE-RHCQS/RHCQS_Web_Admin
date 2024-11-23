import { useState, useEffect, useCallback, useRef } from 'react';
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
  PromotionInfo,
} from '../../../types/InitialQuotationTypes';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import ConstructionAreaTable from './components/Table/ConstructionAreaTable';
import { TableRow } from './components/types';
import UtilityTable from './components/Table/UtilityTable';
import ConstructionPrice from './components/Table/ConstructionPrice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaPlus, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { Promotion } from '../../../types/SearchContainNameTypes';
import { getPromotionByName } from '../../../api/Promotion/PromotionApi';

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
  const [promotionInfo, setPromotionInfo] = useState<PromotionInfo | null>(
    null,
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [utilityInfos, setUtilityInfos] = useState<QuotationUtility[]>([]);
  const [othersAgreement, setOthersAgreement] = useState<string>('');
  const [searchName, setSearchName] = useState<string>('');
  const [promotionList, setPromotionList] = useState<Promotion[]>([]);
  const previousSearchNameRef = useRef<string>('');

  useEffect(() => {
    const fetchQuotationData = async () => {
      if (projectId) {
        try {
          const data = await createNewInitialQuotation(projectId);
          setQuotationData(data);

          const initialTableData = data.ItemInitial.map(convertToTableRow);
          setTableData(initialTableData);

          setUtilityInfos(data.UtilityInfos.map(convertToQuotationUtility));

          if (data.PromotionInfo) {
            setPromotionInfo({
              Id: data.PromotionInfo.Id,
              Name: data.PromotionInfo.Name,
              Value: data.PromotionInfo.Value || 0,
            });
          }
        } catch (error) {
          console.error('Error fetching initial quotation:', error);
        }
      }
    };
    fetchQuotationData();
  }, [projectId]);

  useEffect(() => {
    if (!quotationData) return;

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

    const giaTriHopDong =
      tableData.length > 0
        ? thanhTien + totalUtilityCost - (promotionInfo?.Value || 0)
        : totalUtilityCost - (promotionInfo?.Value || 0);

    setPaymentSchedule((prevSchedule) =>
      prevSchedule.map((payment) => ({
        ...payment,
        price: (giaTriHopDong * parseFloat(payment.percents || '0')) / 100,
      })),
    );
  }, [utilityInfos, tableData, promotionInfo, quotationData]);

  const fetchPromotions = useCallback(async () => {
    const { IdPackageFinished, IdPackageRough } =
      quotationData?.PackageQuotationList || {};

    if (
      searchName.trim() === '' ||
      searchName === previousSearchNameRef.current
    ) {
      setPromotionList([]);
      return;
    }

    try {
      const promotionsFinished: Promotion[] = IdPackageFinished
        ? await getPromotionByName(searchName, IdPackageFinished)
        : [];

      const promotionsRough: Promotion[] = IdPackageRough
        ? await getPromotionByName(searchName, IdPackageRough)
        : [];

      setPromotionList([...promotionsFinished, ...promotionsRough]);
      previousSearchNameRef.current = searchName;
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  }, [searchName, quotationData?.PackageQuotationList]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handlePromotionSelect = (promotion: Promotion) => {
    setPromotionInfo({
      Id: promotion.Id,
      Name: promotion.Name,
      Value: promotion.Value,
    });
    setSearchName('');
    setPromotionList([]);
  };

  const convertToTableRow = (item: any, index: number) => ({
    stt: index + 1,
    hangMuc: item.SubConstruction || item.Name,
    dTich: item.Area.toString(),
    heSo:
      item.Coefficient !== 0
        ? item.Coefficient.toString()
        : item.SubCoefficient
        ? item.SubCoefficient.toString()
        : '0',
    dienTich: (
      item.Area *
      (item.Coefficient !== 0 ? item.Coefficient : item.SubCoefficient || 1)
    ).toString(),
    donVi: 'm²',
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
      ? thanhTien + totalUtilityCost - (promotionInfo?.Value || 0)
      : totalUtilityCost - (promotionInfo?.Value || 0);

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
        numberOfBatch: paymentSchedule.length + 1,
        price: 0,
        percents: 0,
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
    if (promotionInfo) {
      setPromotionInfo({ ...promotionInfo, [field]: value });
    } else {
      setPromotionInfo({
        Id: field === 'Id' ? value : '',
        Name: field === 'Name' ? value : '',
        Value: field === 'Value' ? value : 0,
      });
    }
  };

  const handleCreateInitialQuote = async () => {
    if (!quotationData) return;

    setIsButtonDisabled(true);

    const isInvalidPromotion =
      !promotionInfo ||
      promotionInfo.Id === '00000000-0000-0000-0000-000000000000' ||
      promotionInfo.Value === 0;

    const requestData: UpdateInitialQuotationRequest = {
      accountName: quotationData.AccountName,
      address: quotationData.Address,
      versionPresent: 0,
      projectId: quotationData.ProjectId,
      isSave: true,
      area: quotationData.Area,
      timeProcessing: quotationData.TimeProcessing,
      timeRough: quotationData.TimeRough,
      timeOthers: quotationData.TimeOthers,
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
      promotions: isInvalidPromotion
        ? null
        : { id: promotionInfo.Id, discount: promotionInfo.Value || 0 },
      batchPayments: paymentSchedule.map((payment) => ({
        numberOfBatch: payment.numberOfBatch,
        price: payment.price,
        percents: payment.percents,
        description: payment.description,
        paymentDate: payment.paymentDate,
        paymentPhase: payment.paymentPhase,
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

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (quotationData) {
      setQuotationData({
        ...quotationData,
        AccountName: e.target.value,
      });
    }
  };

  const handleProjectAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (quotationData) {
      setQuotationData({
        ...quotationData,
        Address: e.target.value,
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">
        Khởi tạo báo giá sơ bộ
      </h2>
      <div className="mb-4">
        <div className="mb-2 text-lg flex items-center">
          <FaUser className="mr-2 text-secondary" />
          <span className="font-semibold">Tên khách hàng:</span>
          <input
            type="text"
            value={quotationData.AccountName}
            onChange={handleCustomerNameChange}
            className="ml-2 border border-gray-300 rounded-md p-2"
          />
        </div>
        <div className="mb-2 text-lg flex items-center">
          <FaMapMarkerAlt className="mr-2 text-secondary" />
          <span className="font-semibold">Địa chỉ thi công:</span>
          <input
            type="text"
            value={quotationData.Address}
            onChange={handleProjectAddressChange}
            className="ml-2 border border-gray-300 rounded-md p-2"
          />
        </div>
        <p>
          <strong>Giảm giá:</strong> {quotationData.Discount} VNĐ
        </p>
      </div>

      <div className="flex items-center">
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
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <strong className="mt-4 mb-4 text-lg inline-block text-secondary">
                  Diện tích xây dựng theo phương án thiết kế:
                </strong>
              </div>
              <button
                onClick={addTableRow}
                className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
              >
                <FaPlus />
              </button>
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
            <div className="mb-4">
              <strong className="text-xl text-secondary">
                2. GIÁ TRỊ BÁO GIÁ SƠ BỘ XÂY DỰNG TRƯỚC THUẾ:
              </strong>
            </div>

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
                      <strong>{thanhTien.toLocaleString()} đồng</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center mb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <strong className="text-xl font-bold text-secondary">
              {sectionNumber}. TÙY CHỌN & TIỆN ÍCH:
            </strong>
          </div>
          <button
            onClick={addUtilityRow}
            className="ml-4 bg-primaryGreenButton text-white w-8 h-8 flex items-center justify-center rounded-full shadow-lg hover:bg-secondaryGreenButton transition-colors duration-200"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      <UtilityTable
        utilityInfos={utilityInfos}
        setUtilityInfos={setUtilityInfos}
        isEditing={true}
      />

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionNumber + 1}. KHUYẾN MÃI:
          </strong>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border text-center">Tên khuyến mãi</th>
                <th className="px-4 py-2 border text-center">Giá trị</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 border text-center">
                  <input
                    type="text"
                    placeholder="Tên khuyến mãi"
                    value={promotionInfo?.Name || ''}
                    onChange={(e) => {
                      handlePromotionChange('Name', e.target.value);
                      setSearchName(e.target.value);
                    }}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    list="promotion-suggestions"
                  />
                  {promotionList.length > 0 && (
                    <ul className="promotion-list border border-gray-300 rounded mt-2">
                      {promotionList.map((promotion) => (
                        <li
                          key={promotion.Id}
                          onClick={() => handlePromotionSelect(promotion)}
                          className="promotion-item cursor-pointer hover:bg-gray-200 p-2"
                        >
                          {promotion.Name}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-2 border text-center">
                  <span>
                    {promotionInfo?.Value?.toLocaleString() || '0'} VNĐ
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionNumber + 2}. TỔNG HỢP GIÁ TRỊ HỢP ĐỒNG:
          </strong>
        </div>
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
                    {promotionInfo.Name}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    - {promotionInfo?.Value?.toLocaleString()}VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center">VNĐ</td>
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
        <div className="flex items-center mb-4">
          <strong className="text-xl text-secondary">
            {sectionNumber + 3}. CÁC ĐỢT THANH TOÁN:
          </strong>
        </div>
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
                  <th className="px-4 py-2 border text-center">
                    Ngày thanh toán
                  </th>
                  <th className="px-4 py-2 border text-center">
                    Giai đoạn thanh toán
                  </th>
                  <th className="px-4 py-2 border text-center"></th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((payment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">
                      {payment.numberOfBatch}
                    </td>
                    <td className="px-4 py-2 border text-center">
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
                          type="number"
                          value={payment.percents}
                          onChange={(e) =>
                            handlePaymentScheduleChange(
                              index,
                              'percents',
                              parseFloat(e.target.value) || 0,
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
                      <input
                        type="date"
                        value={payment.paymentDate}
                        onChange={(e) =>
                          handlePaymentScheduleChange(
                            index,
                            'paymentDate',
                            e.target.value,
                          )
                        }
                        className="w-full bg-transparent text-center"
                      />
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <input
                        type="date"
                        value={payment.paymentPhase}
                        onChange={(e) =>
                          handlePaymentScheduleChange(
                            index,
                            'paymentPhase',
                            e.target.value,
                          )
                        }
                        className="w-full bg-transparent text-center"
                      />
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
                    colSpan={3}
                  >
                    TỔNG GIÁ TRỊ HỢP ĐỒNG
                  </td>
                  <td className="px-4 py-2 border text-center font-bold">
                    {totalPaymentValue.toLocaleString()} VNĐ
                  </td>
                  <td className="px-4 py-2 border text-center"></td>
                  <td className="px-4 py-2 border text-center"></td>
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

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionNumber + 4}. CÁC THỎA THUẬN KHÁC:
          </strong>
        </div>
        <textarea
          value={othersAgreement}
          onChange={(e) => setOthersAgreement(e.target.value)}
          className="w-full p-2 border rounded h-32"
          placeholder="Nhập nội dung thỏa thuận khác..."
        />
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <strong className="text-xl text-secondary">
            {sectionNumber + 5}. THỜI GIAN THI CÔNG:
          </strong>
        </div>

        <div className="mb-4">
          <p>
            <strong>Thời gian hoàn thành công trình là:</strong>{' '}
            <input
              type="number"
              value={quotationData.TimeProcessing || ''}
              onChange={(e) =>
                setQuotationData({
                  ...quotationData,
                  TimeProcessing: parseInt(e.target.value) || 0,
                })
              }
              className="w-20 p-1 border rounded"
            />{' '}
            Ngày
          </p>
          <p>
            <em>Trong đó:</em>
          </p>
          <p style={{ marginLeft: '20px' }}>
            <em>Thời gian thi công phần thô:</em>{' '}
            <input
              type="number"
              value={quotationData.TimeRough || ''}
              onChange={(e) =>
                setQuotationData({
                  ...quotationData,
                  TimeRough: parseInt(e.target.value) || 0,
                })
              }
              className="w-20 p-1 border rounded"
            />{' '}
            Ngày
          </p>
          <p style={{ marginLeft: '20px' }}>
            <em>Phối hợp với CT hoàn thiện công trình:</em>{' '}
            <input
              type="number"
              value={quotationData.TimeOthers || ''}
              onChange={(e) =>
                setQuotationData({
                  ...quotationData,
                  TimeOthers: parseInt(e.target.value) || 0,
                })
              }
              className="w-20 p-1 border rounded"
            />{' '}
            Ngày
          </p>
        </div>
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
