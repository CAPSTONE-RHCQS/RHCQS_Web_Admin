import React, { useState } from 'react';
import SwitcherTwo from '../../../components/Switchers/SwitcherTwo';

interface Tab2Props {
  items: {
    name: string;
    totalCost: number;
    quantity: number;
    coefficient: number;
    totalAmount: number;
    enabled: boolean;
  }[];
  handleChangeItem: (
    index: number,
    field: string,
    value: number | boolean,
  ) => void;
}

const Tab2: React.FC<Tab2Props> = ({ items, handleChangeItem }) => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="mb-4 border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-lg font-medium">{item.name}</label>
            <SwitcherTwo
              id={`switcher-${index}`}
              enabled={item.enabled}
              setEnabled={(enabled) =>
                handleChangeItem(index, 'enabled', enabled)
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Tổng phí"
              value={item.totalCost}
              onChange={(e) =>
                handleChangeItem(index, 'totalCost', Number(e.target.value))
              }
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Số lượng"
              value={item.quantity}
              onChange={(e) =>
                handleChangeItem(index, 'quantity', Number(e.target.value))
              }
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Hệ số"
              value={item.coefficient}
              onChange={(e) =>
                handleChangeItem(index, 'coefficient', Number(e.target.value))
              }
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Thành tiền"
              value={item.totalCost * item.quantity * item.coefficient}
              readOnly
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tab2;
