import React, { useState } from 'react';
import SelectGroupTwo from '../../../components/Forms/SelectGroup/SelectGroupTwo';
import CheckboxTwo from '../../../components/Checkboxes/CheckboxTwo';
import { HomeModernIcon, BuildingOfficeIcon, BuildingLibraryIcon, HomeIcon, BuildingStorefrontIcon, Cog6ToothIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

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
  hasBasement: boolean;
  setHasBasement: (value: boolean) => void;
  hasMezzanine: boolean;
  setHasMezzanine: (value: boolean) => void;
  hasTerrace: boolean;
  setHasTerrace: (value: boolean) => void;
  hasRoof: boolean;
  setHasRoof: (value: boolean) => void;
  hasSecondaryRoof: boolean;
  setHasSecondaryRoof: (value: boolean) => void;
  hasElevatorTechnicalRoom: boolean;
  setHasElevatorTechnicalRoom: (value: boolean) => void;
  hasPit: boolean;
  setHasPit: (value: boolean) => void;
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
  hasBasement,
  setHasBasement,
  hasMezzanine,
  setHasMezzanine,
  hasTerrace,
  setHasTerrace,
  hasRoof,
  setHasRoof,
  hasSecondaryRoof,
  setHasSecondaryRoof,
  hasElevatorTechnicalRoom,
  setHasElevatorTechnicalRoom,
  hasPit,
  setHasPit,
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
            Diện tích đất (m2):
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
            Diện tích xây dựng (m2):
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
      <div className="w-full md:w-1/2 pl-4">
        <div className="mb-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <HomeModernIcon className="h-5 w-5 text-gray-500 mr-2" />
              <label htmlFor="basement" className="mr-2">
                Hầm
              </label>
            </div>
            <CheckboxTwo
              id="basement"
              isChecked={hasBasement}
              onChange={() => setHasBasement(!hasBasement)}
            />
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-500 mr-2" />
              <label htmlFor="mezzanine" className="mr-2">
                Tầng lửng
              </label>
            </div>
            <CheckboxTwo
              id="mezzanine"
              isChecked={hasMezzanine}
              onChange={() => setHasMezzanine(!hasMezzanine)}
            />
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <BuildingLibraryIcon className="h-5 w-5 text-gray-500 mr-2" />
              <label htmlFor="terrace" className="mr-2">
                Tầng Thượng
              </label>
            </div>
            <CheckboxTwo
              id="terrace"
              isChecked={hasTerrace}
              onChange={() => setHasTerrace(!hasTerrace)}
            />
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <HomeIcon className="h-5 w-5 text-gray-500 mr-2" />
              <label htmlFor="roof" className="mr-2">
                Mái
              </label>
            </div>
            <CheckboxTwo
              id="roof"
              isChecked={hasRoof}
              onChange={() => setHasRoof(!hasRoof)}
            />
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <BuildingStorefrontIcon className="h-5 w-5 text-gray-500 mr-2" />
              <label htmlFor="secondaryRoof" className="mr-2">
                Mái phụ
              </label>
            </div>
            <CheckboxTwo
              id="secondaryRoof"
              isChecked={hasSecondaryRoof}
              onChange={() => setHasSecondaryRoof(!hasSecondaryRoof)}
            />
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <Cog6ToothIcon className="h-5 w-5 text-gray-500 mr-2" />
              <label htmlFor="elevatorTechnicalRoom" className="mr-2">
                Phòng kỹ thuật thang máy
              </label>
            </div>
            <CheckboxTwo
              id="elevatorTechnicalRoom"
              isChecked={hasElevatorTechnicalRoom}
              onChange={() =>
                setHasElevatorTechnicalRoom(!hasElevatorTechnicalRoom)
              }
            />
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center">
              <ArchiveBoxIcon className="h-5 w-5 text-gray-500 mr-2" />
              <label htmlFor="pit" className="mr-2">
                Hố PIT
              </label>
            </div>
            <CheckboxTwo
              id="pit"
              isChecked={hasPit}
              onChange={() => setHasPit(!hasPit)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
