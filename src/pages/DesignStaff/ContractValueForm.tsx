import React from 'react';

interface ContractValueFormProps {
  contractDetails: {
    constructionArea: string;
    designUnitPrice: string;
    contractValue: string;
    payment1: string;
    payment2: string;
  };
  handleChangeContractDetails: (field: string, value: string) => void;
}

const ContractValueForm: React.FC<ContractValueFormProps> = ({
  contractDetails,
  handleChangeContractDetails,
}) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Giá trị hợp đồng & Phương thức thanh toán
      </h3>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Diện tích xây dựng:
        </label>
        <input
          type="text"
          value={contractDetails.constructionArea}
          onChange={(e) =>
            handleChangeContractDetails('constructionArea', e.target.value)
          }
          className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Đơn giá thiết kế:
        </label>
        <input
          type="text"
          value={contractDetails.designUnitPrice}
          onChange={(e) =>
            handleChangeContractDetails('designUnitPrice', e.target.value)
          }
          className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Giá trị hợp đồng:
        </label>
        <input
          type="text"
          value={contractDetails.contractValue}
          onChange={(e) =>
            handleChangeContractDetails('contractValue', e.target.value)
          }
          className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Đợt 1: ~50% tổng giá trị của hợp đồng ngay sau khi ký kết hợp đồng
        </label>
        <input
          type="text"
          value={contractDetails.payment1}
          onChange={(e) =>
            handleChangeContractDetails('payment1', e.target.value)
          }
          className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">
          Đợt 2: ~50% tổng giá trị của hợp đồng vào thời điểm khi bên B bàn giao
          toàn bộ hồ sơ thiết kế kỹ thuật
        </label>
        <input
          type="text"
          value={contractDetails.payment2}
          onChange={(e) =>
            handleChangeContractDetails('payment2', e.target.value)
          }
          className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          required
        />
      </div>
    </div>
  );
};

export default ContractValueForm;
