import React from 'react';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';

interface Step1Props {
  area: string;
  setArea: (value: string) => void;
  landArea: number;
  setLandArea: (value: number) => void;
  price: number;
  setPrice: (value: number) => void;
  numberOfBedrooms: number;
  setNumberOfBedrooms: (value: number) => void;
  numberOfFloors: number;
  setNumberOfFloors: (value: number) => void;
}

const Step1: React.FC<Step1Props> = ({
  area,
  setArea,
  landArea,
  setLandArea,
  price,
  setPrice,
  numberOfBedrooms,
  setNumberOfBedrooms,
  numberOfFloors,
  setNumberOfFloors,
}) => {
  const areaOptions = [
    { value: 'north', label: 'Khu vực miền Bắc' },
    { value: 'central', label: 'Khu vực miền Trung' },
    { value: 'south', label: 'Khu vực miền Nam' },
  ];

  const bedroomOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ];

  const floorOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '5', label: '5' },
  ];

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, ''));
    setPrice(value);
  };

  return (
    <div className="flex grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Chọn khu vực:
          </label>
          <SelectGroupTwo
            options={areaOptions}
            selectedOption={area}
            onChange={(value) => setArea(value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Diện tích (m²):
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
            Giá (vnđ):
          </label>
          <input
            type="text"
            value={formatCurrency(price)}
            onChange={handlePriceChange}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Số lượng phòng ngủ:
          </label>
          <SelectGroupTwo
            options={bedroomOptions}
            selectedOption={numberOfBedrooms.toString()}
            onChange={(value) => setNumberOfBedrooms(Number(value))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Số lượng phòng tầng:
          </label>
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
