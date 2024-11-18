import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { PencilIcon } from '@heroicons/react/24/solid';
import Alert from '../../../../../components/Alert';
import EditSupplier from '../Edit/EditSuplier';
import { SupplierItem, UpdateSupplierRequest } from '../../../../../types/Supplier';
import { updateSupplier } from '../../../../../api/Supplier/Supplier';

interface SupplierTableProps {
  dataSupplier: SupplierItem[];
  openItems: Set<number>;
  editModalOpen: boolean;
  openEditModal: (id: string) => void;
  currentEditId: string | null;
  refreshData: () => void;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  dataSupplier,
  editModalOpen,
  openEditModal,
  currentEditId,
  refreshData,
}) => {
  const [activeEditIndex, setActiveEditIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(editModalOpen);
  const [inputValue, setInputValue] = useState<UpdateSupplierRequest>({
    Name: '',
    Email: '',
    ConstractPhone: '',
    ImgUrl: '',
    Code: '',
    Deflag: true,
    ShortDescription: '',
    Description: '',
    Image: '',
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
    name: string,
    email: string,
    constractPhone: string,
    imgUrl: string,
    code: string,
    deflag: boolean,
    shortDescription: string,
    description: string,
    image: string,
  ) => {
    console.log('id', id);
    event.stopPropagation();
    setInputValue({
      Name: name || '',
      Email: email || '',
      ConstractPhone: constractPhone || '',
      ImgUrl: imgUrl || '',
      Code: code || '',
      Deflag: deflag,
      ShortDescription: shortDescription || '',
      Description: description || '',
      Image: image || '',
    });
    setIsModalOpen(true);
    openEditModal(id);
  };

  const handleInputChange = (field: string, value: string) => {
    setInputValue((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      if (currentEditId) {
        await updateSupplier(currentEditId, inputValue);
        console.log('inputValue', inputValue);
        console.log('thành công');
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

  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {['Tên công ty', 'Mô tả', ''].map((header) => (
              <th
                key={header}
                className="py-4 px-4 font-medium text-black dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSupplier.map((item, index) => (
            <React.Fragment key={index}>
              <tr className="cursor-pointer">
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark flex items-center">
                  {item.Name}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  {item.ShortDescription}
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark relative">
                  <div className="flex justify-center relative" ref={editRef}>
                    <button
                      className="cursor-pointer"
                      onClick={(event) => {
                        handleEditClick(
                          event,
                          item.Id,
                          item.Name,
                          item.Email || '',
                          item.ConstractPhone || '',
                          item.ImgUrl || '',
                          item.Code || '',
                          item.Deflag,
                          item.ShortDescription || '',
                          item.Description || '',
                          item.Image || '',
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
        <EditSupplier
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

export default SupplierTable;
