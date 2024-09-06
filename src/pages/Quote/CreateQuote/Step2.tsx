import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import DeleteButton from '../../../components/Buttonicons/DeleteButton';
import SelectGroupTwo from '../../../components/Forms/SelectGroup/SelectGroupTwo';

interface Step2Props {
  items: {
    hangMuc: string;
    dTich: string;
    heSo: string;
    dienTich: string;
    donVi: string;
  }[];
  hangMucOptions: { value: string; label: string; disabled?: boolean }[];
  unitOptions: { value: string; label: string }[];
  handleAddItem: () => void;
  handleRemoveItem: (index: number) => void;
  handleChangeItem: (index: number, field: string, value: string) => void;
  setItems: (items: any[]) => void;
  hasBasement: boolean;
  hasMezzanine: boolean;
  hasTerrace: boolean;
  hasRoof: boolean;
  hasSecondaryRoof: boolean;
  hasElevatorTechnicalRoom: boolean;
  hasPit: boolean;
}

const Step2: React.FC<Step2Props> = ({
  items,
  hangMucOptions,
  unitOptions,
  handleAddItem,
  handleRemoveItem,
  handleChangeItem,
  setItems,
  hasBasement,
  hasMezzanine,
  hasTerrace,
  hasRoof,
  hasSecondaryRoof,
  hasElevatorTechnicalRoom,
  hasPit,
}) => {
  const [activeTab, setActiveTab] = useState('tab1');

  useEffect(() => {
    const predefinedItems = [
      { condition: true, value: 'Móng' },
      { condition: true, value: 'Trệt' },
      { condition: true, value: 'Sân' },
      { condition: hasBasement, value: 'Hầm' },
      { condition: hasMezzanine, value: 'Tầng lửng' },
      { condition: hasTerrace, value: 'Tầng thượng' },
      { condition: hasRoof, value: 'Mái' },
      { condition: hasSecondaryRoof, value: 'Mái phụ' },
      {
        condition: hasElevatorTechnicalRoom,
        value: 'Phòng kỹ thuật thang máy',
      },
      { condition: hasPit, value: 'Hố PIT' },
    ];

    const newItems = predefinedItems
      .filter((item) => item.condition)
      .map((item) => ({
        hangMuc: item.value,
        dTich: '',
        heSo: '',
        dienTich: '',
        donVi: 'm²',
      }));

    setItems(newItems);
  }, [
    hasBasement,
    hasMezzanine,
    hasTerrace,
    hasRoof,
    hasSecondaryRoof,
    hasElevatorTechnicalRoom,
    hasPit,
    setItems,
  ]);

  return (
    <div>
      <div className="mb-4">
        <div className="mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === 'tab1' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('tab1')}
          >
            Xây Thô tiêu chuẩn
          </button>
          <button
            className={`px-4 py-2 ml-2 ${
              activeTab === 'tab2' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
            onClick={() => setActiveTab('tab2')}
          >
            Tùy chọn và tiện ích
          </button>
        </div>
        {activeTab === 'tab1' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-lg font-medium mb-2">
                Các hạng mục:
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded flex items-center"
              >
                <FaPlus className="mr-2" />
                Thêm
              </button>
            </div>
            {items.map((item, index) => (
              <div key={index} className="mb-4 border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <label className="block text-lg font-medium">
                    Hạng mục {index + 1}
                  </label>
                  <DeleteButton onClick={() => handleRemoveItem(index)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <SelectGroupTwo
                    options={hangMucOptions}
                    selectedOption={
                      hangMucOptions.find(
                        (option) => option.value === item.hangMuc,
                      )?.value ?? ''
                    }
                    onChange={(value) =>
                      handleChangeItem(index, 'hangMuc', value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="Hệ số"
                    value={item.heSo}
                    onChange={(e) =>
                      handleChangeItem(index, 'heSo', e.target.value)
                    }
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Diện tích"
                    value={item.dienTich}
                    onChange={(e) =>
                      handleChangeItem(index, 'dienTich', e.target.value)
                    }
                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                    required
                  />
                  <SelectGroupTwo
                    options={unitOptions}
                    selectedOption={
                      unitOptions.find((option) => option.value === item.donVi)
                        ?.value ?? ''
                    }
                    onChange={(value) =>
                      handleChangeItem(index, 'donVi', value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'tab2' && (
          <div>
            {/* Nội dung của tab 2: Tùy chọn và tiện ích */}
            {/* Thêm các thành phần tương tự như tab 1 nếu cần */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2;
