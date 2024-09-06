import React, { useState } from 'react';
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
}) => {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div>
      <div className="mb-4">
        <div className="mb-4">
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
                {/* <label className="block text-lg font-medium">
                  Hạng mục {index + 1}
                </label> */}
                <div></div>
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
                  onChange={(value) => handleChangeItem(index, 'donVi', value)}
                />
              </div>
            </div>
          ))}
        </div>
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
