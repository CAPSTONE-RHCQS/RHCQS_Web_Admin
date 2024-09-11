import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import DeleteButton from '../../../../components/Buttonicons/DeleteButton';
import SelectGroupTwo from '../../../../components/Forms/SelectGroup/SelectGroupTwo';
import Tab1 from './Tab1';
import Tab2 from './Tab2';

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
  tab2Items: {
    name: string;
    totalCost: number;
    quantity: number;
    coefficient: number;
    totalAmount: number;
    enabled: boolean;
  }[];
  handleChangeTab2Item: (
    index: number,
    field: string,
    value: number | boolean,
  ) => void;
}

const Step2: React.FC<Step2Props> = ({
  items,
  hangMucOptions,
  unitOptions,
  handleAddItem,
  handleRemoveItem,
  handleChangeItem,
  setItems,
  tab2Items,
  handleChangeTab2Item,
}) => {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Báo giá xây thô</h2>
      <div className="mb-4">
        <div className="flex mb-4">
          <button
            className={`px-4 py-2 ${
              activeTab === 'tab1'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setActiveTab('tab1')}
          >
            Xây Thô Tiêu Chuẩn
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === 'tab2'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setActiveTab('tab2')}
          >
            Tùy chọn & tiện ích
          </button>
        </div>

        {activeTab === 'tab1' && (
          <Tab1
            items={items}
            hangMucOptions={hangMucOptions}
            unitOptions={unitOptions}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            handleChangeItem={handleChangeItem}
          />
        )}
        {activeTab === 'tab2' && (
          <Tab2 items={tab2Items} handleChangeItem={handleChangeTab2Item} />
        )}
      </div>
    </div>
  );
};

export default Step2;
