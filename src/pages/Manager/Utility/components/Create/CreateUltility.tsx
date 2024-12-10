import React, { useState } from 'react';
import { postUtility } from '../../../../../api/Utility/UtilityApi';

interface CreateUtilityProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onError: (message: string) => void;
}

const CreateUtility: React.FC<CreateUtilityProps> = ({
  isOpen,
  onClose,
  onSave,
  onCancel,
  onError,
}) => {
  const [sectionDetail, setSectionDetail] = useState<any>({
    Name: '',
    Type: '',
    Sections: [
      {
        id: null,
        name: '',
        description: '',
        unitPrice: 0,
        unit: '',
      },
    ],
  });
  const [newUtilityName, setNewUtilityName] = useState<string>('');

  if (!isOpen) return null;

  const addSection = () => {
    setSectionDetail((prev: any) => ({
      ...prev,
      Sections: [
        ...prev.Sections,
        {
          id: null,
          name: '',
          description: '',
          unitPrice: 0,
          unit: '',
        },
      ],
    }));
  };

  const removeSection = (index: number) => {
    setSectionDetail((prev: any) => ({
      ...prev,
      Sections: prev.Sections.filter((_: any, i: any) => i !== index),
    }));
  };

  const handleSave = async () => {
    const utilityData = {
      id: null,
      name: newUtilityName,
      type: sectionDetail.Type,
      sections: sectionDetail.Sections.map((section: any) => ({
        id: null,
        name: section.name,
        description: section.description,
        unitPrice: section.unitPrice,
        unit: section.unit,
      })),
      items: null,
    };

    try {
      const response = await postUtility(utilityData);
      console.log('Utility created successfully:', response);
      onSave(response);
    } catch (error: any) {
        console.error('Error creating utility:', error);
        onError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[80vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-4">
          <div className="flex text-primaryGreenButton font-bold justify-between items-center mb-4">
            <h1 className="text-2xl">Tạo tiện ích mới</h1>
          </div>
          <button
            onClick={onClose}
            className="text-black font-bold text-3xl mb-2"
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <strong className="font-bold">Nhập tên tiện ích mới:</strong>
          <input
            type="text"
            value={newUtilityName}
            onChange={(e) => setNewUtilityName(e.target.value)}
            className="border p-2 w-full rounded font-regular"
            placeholder="Tên tiện ích mới"
          />
        </div>
        <div className="mb-4">
          <strong className="font-bold">Loại tiện ích:</strong>
          <select
            value={sectionDetail.Type}
            onChange={(e) =>
              setSectionDetail({
                ...sectionDetail,
                Type: e.target.value,
              })
            }
            className="border p-2 w-full rounded font-regular"
          >
            <option value="ROUGH">THÔ</option>
            <option value="FINISHED">HOÀN THIỆN</option>
            <option value="TEMPLATE">MẪU NHÀ</option>
          </select>
        </div>
        <hr className="my-4 border-t border-black" />
        {sectionDetail.Sections.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <span className="font-bold text-black">Phần tiện ích</span>
              <button
                onClick={addSection}
                className="text-primaryGreenButton px-4 py-2 rounded font-bold"
              >
                + Thêm phần
              </button>
            </div>
            {sectionDetail.Sections.map((section: any, index: any) => (
              <div
                key={index}
                className="mb-4 border-2 border-black rounded p-4 "
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Phần tiện ích {index + 1}</span>
                  <div>
                    {sectionDetail.Sections.length > 1 && (
                      <button
                        onClick={() => removeSection(index)}
                        className="text-red-500 font-bold"
                      >
                        Xóa phần
                      </button>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    value={section.name}
                    placeholder="Tên phần"
                    onChange={(e) => {
                      const newSections = [...sectionDetail.Sections];
                      newSections[index].name = e.target.value;
                      setSectionDetail({
                        ...sectionDetail,
                        Sections: newSections,
                      });
                    }}
                    className="border p-2 w-full rounded font-regular"
                  />
                  <strong className="font-bold">Mô tả:</strong>
                  <input
                    type="text"
                    value={section.description}
                    placeholder="Mô tả"
                    onChange={(e) => {
                      const newSections = [...sectionDetail.Sections];
                      newSections[index].description = e.target.value;
                      setSectionDetail({
                        ...sectionDetail,
                        Sections: newSections,
                      });
                    }}
                    className="border p-2 w-full rounded font-regular"
                  />
                  <div className="flex space-x-2">
                    <div className="flex-grow">
                      <strong className="font-bold">Đơn giá:</strong>
                      <input
                        type="number"
                        value={section.unitPrice}
                        placeholder="Đơn giá"
                        onChange={(e) => {
                          const newSections = [...sectionDetail.Sections];
                          newSections[index].unitPrice = parseFloat(
                            e.target.value,
                          );
                          setSectionDetail({
                            ...sectionDetail,
                            Sections: newSections,
                          });
                        }}
                        className="border p-2 w-full rounded font-regular"
                      />
                    </div>
                    <div className="w-1/4">
                      <strong className="font-bold">Đơn vị:</strong>
                      <input
                        type="text"
                        value={section.unit}
                        onChange={(e) => {
                          const newSections = [...sectionDetail.Sections];
                          newSections[index].unit = e.target.value;
                          setSectionDetail({
                            ...sectionDetail,
                            Sections: newSections,
                          });
                        }}
                        className="border p-2 w-full rounded font-regular"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="text-black px-4 py-2 rounded font-bold"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="bg-primaryGreenButton text-white px-4 py-2 rounded font-bold"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUtility;
