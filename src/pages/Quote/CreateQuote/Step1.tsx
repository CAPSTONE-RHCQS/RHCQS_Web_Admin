import React from 'react';
import SelectGroupTwo from '../../../components/Forms/SelectGroup/SelectGroupTwo';

interface Step1Props {
  customerName: string;
  setCustomerName: (value: string) => void;
  constructionAddress: string;
  setConstructionAddress: (value: string) => void;
  unitPrice: string;
  setUnitPrice: (value: string) => void;
  unitPriceOptions: { value: string; label: string }[];
  landArea: number;
  setLandArea: (value: number) => void;
  constructionArea: number;
  setConstructionArea: (value: number) => void;
  numberOfFloors: number;
  setNumberOfFloors: (value: number) => void;
}

const Step1: React.FC<Step1Props> = ({
  customerName,
  setCustomerName,
  constructionAddress,
  setConstructionAddress,
  unitPrice,
  setUnitPrice,
  unitPriceOptions,
  landArea,
  setLandArea,
  constructionArea,
  setConstructionArea,
  numberOfFloors,
  setNumberOfFloors,
}) => {
  const floorOptions = [
    { value: '1', label: '1 Tầng Lầu' },
    { value: '2', label: '2 Tầng Lầu' },
    { value: '3', label: '3 Tầng Lầu' },
    { value: '4', label: '4 Tầng Lầu' },
    { value: '5', label: '5 Tầng Lầu' },
    { value: '6', label: '6 Tầng Lầu' },
  ];

  return (
    <div className="flex grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Tên khách hàng:
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Địa chỉ thi công:
          </label>
          <input
            type="text"
            value={constructionAddress}
            onChange={(e) => setConstructionAddress(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
      </div>
      <div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Đơn giá thi công:
          </label>
          <SelectGroupTwo
            options={[
              { value: '', label: 'Chọn đơn giá', disabled: true },
              ...unitPriceOptions,
            ]}
            selectedOption={unitPrice}
            onChange={(value) => setUnitPrice(value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Diện tích đất (m²):
          </label>
          <input
            type="number"
            value={landArea}
            onChange={(e) => setLandArea(Number(e.target.value))}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Diện tích xây dựng (m²):
          </label>
          <input
            type="number"
            value={constructionArea}
            onChange={(e) => setConstructionArea(Number(e.target.value))}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Số tầng lầu:</label>
          <SelectGroupTwo
            options={floorOptions}
            selectedOption={numberOfFloors.toString()}
            onChange={(value) => setNumberOfFloors(Number(value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Step1;
