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
  const [tab2Items, setTab2Items] = useState([
    { name: 'Chi phí thi công sàn nhỏ hơn 70m²', totalCost: 0, quantity: 0, coefficient: 0, totalAmount: 0, enabled: false },
    { name: 'Chi phí thi công công trình hẻm nhỏ', totalCost: 0, quantity: 0, coefficient: 0, totalAmount: 0, enabled: false },
    { name: 'Hỗ trợ bãi tập kết, điều kiện thi công khó khăn', totalCost: 0, quantity: 0, coefficient: 0, totalAmount: 0, enabled: false },
    { name: 'Chi phí thi công nhà 2 mặt tiền trở lên', totalCost: 0, quantity: 0, coefficient: 0, totalAmount: 0, enabled: false },
    { name: 'Chi phí thi công công trình tỉnh', totalCost: 0, quantity: 0, coefficient: 0, totalAmount: 0, enabled: false },
  ]);

  const handleChangeTab2Item = (index: number, field: string, value: number | boolean) => {
    const newItems = [...tab2Items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field !== 'enabled') {
      newItems[index].totalAmount = newItems[index].totalCost * newItems[index].quantity * newItems[index].coefficient;
    }
    setTab2Items(newItems);
  };

  return (
    <div>
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
          <Tab2
            items={tab2Items}
            handleChangeItem={handleChangeTab2Item}
          />
        )}
      </div>
    </div>
  );
};

export default Step2;
