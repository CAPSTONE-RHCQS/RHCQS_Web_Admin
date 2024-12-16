import React, { useState, useEffect, useRef } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import Alert from '../../../../../components/Alert';
import {
  DesignPriceItem,
  DesignPriceRequest,
} from '../../../../../types/DesignPrice';
import { updateDesignPrice } from '../../../../../api/DesignPrice/DesignPrice';
import EditDesignPrice from '../Edit/EditDesignPrice';

interface DesignPriceTableProps {
  dataDesignPrice: DesignPriceItem[];
  openItems: Set<number>;
  editModalOpen: boolean;
  openEditModal: (id: string) => void;
  currentEditId: string;
  refreshData: () => void;
}

const DesignPriceTable: React.FC<DesignPriceTableProps> = ({
  dataDesignPrice,
  editModalOpen,
  openEditModal,
  currentEditId,
  refreshData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(editModalOpen);
  const [inputValue, setInputValue] = useState<DesignPriceRequest>({
    areaFrom: 0,
    areaTo: 0,
    price: 0,
  });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const editRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsModalOpen(editModalOpen);
  }, [editModalOpen]);

  const handleEditClick = (
    event: React.MouseEvent,
    id: string,
    areaFrom: number,
    areaTo: number,
    price: number,
  ) => {
    event.stopPropagation();
    setInputValue({
      areaFrom: areaFrom,
      areaTo: areaTo,
      price: price,
    });
    setIsModalOpen(true);
    openEditModal(id);
  };

  const handleInputChange = (field: string, value: any) => {
    setInputValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (currentEditId) {
        await updateDesignPrice(inputValue, currentEditId);
        setAlertMessage('Sửa thành công');
        setAlertType('success');
        refreshData();
      }
    } catch (error) {
      setAlertMessage('Sửa thất bại');
      setAlertType('error');
    } finally {
      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  };

  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {['Diện tích ( m2)', 'Giá/m2', 'Ngày cập nhật', ''].map(
              (header) => (
                <th
                  key={header}
                  className="py-4 px-4 font-bold text-black dark:text-white"
                >
                  {header}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {dataDesignPrice.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="cursor-pointer">
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark font-semibold dark:text-primaryGreenButton">
                  {item.AreaFrom} - {item.AreaTo}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 font-semibold dark:border-strokedark text-primaryGreenButton">
                  {formatPrice(item.Price)}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {new Date(item.UpsDate).toLocaleDateString()}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <div className="flex justify-center relative" ref={editRef}>
                    <button
                      className="cursor-pointer"
                      onClick={(event) => {
                        handleEditClick(
                          event,
                          item.Id,
                          item.AreaFrom,
                          item.AreaTo,
                          item.Price,
                        );
                      }}
                      title="Chỉnh sửa"
                    >
                      <PencilIcon className="w-4 h-4 text-primaryGreenButton" />
                    </button>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EditDesignPrice
          isOpen={isModalOpen}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage(null)}
        />
      )}
    </>
  );
};

export default DesignPriceTable;
