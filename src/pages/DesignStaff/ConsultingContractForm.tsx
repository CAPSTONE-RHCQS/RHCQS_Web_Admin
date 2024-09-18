import React from 'react';

interface ConsultingContractFormProps {
  partyA: {
    investor: string;
    address: string;
    phone: string;
    fax: string;
  };
  partyB: {
    consultingCompany: string;
    representativeOffice: string;
    phone: string;
    fax: string;
    accountNumber: string;
    taxNumber: string;
    representative: string;
    position: string;
  };
  handleChangePartyA: (field: string, value: string) => void;
  handleChangePartyB: (field: string, value: string) => void;
}

const ConsultingContractForm: React.FC<ConsultingContractFormProps> = ({
  partyA,
  partyB,
  handleChangePartyA,
  handleChangePartyB,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Bên A (Bên giao thi công)
        </h3>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Chủ đầu tư:</label>
          <input
            type="text"
            value={partyA.investor}
            onChange={(e) => handleChangePartyA('investor', e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Địa chỉ:</label>
          <input
            type="text"
            value={partyA.address}
            onChange={(e) => handleChangePartyA('address', e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Điện thoại:</label>
          <input
            type="text"
            value={partyA.phone}
            onChange={(e) => handleChangePartyA('phone', e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">FAX:</label>
          <input
            type="text"
            value={partyA.fax}
            onChange={(e) => handleChangePartyA('fax', e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Bên B (Bên nhận thi công)
        </h3>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Công ty tư vấn:
          </label>
          <input
            type="text"
            value={partyB.consultingCompany}
            onChange={(e) =>
              handleChangePartyB('consultingCompany', e.target.value)
            }
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Văn phòng đại diện:
          </label>
          <input
            type="text"
            value={partyB.representativeOffice}
            onChange={(e) =>
              handleChangePartyB('representativeOffice', e.target.value)
            }
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Điện thoại:</label>
          <input
            type="text"
            value={partyB.phone}
            onChange={(e) => handleChangePartyB('phone', e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">FAX:</label>
          <input
            type="text"
            value={partyB.fax}
            onChange={(e) => handleChangePartyB('fax', e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label className="block text-lg font-medium mb-2">
              Số tài khoản:
            </label>
            <input
              type="text"
              value={partyB.accountNumber}
              onChange={(e) =>
                handleChangePartyB('accountNumber', e.target.value)
              }
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-lg font-medium mb-2">
              Mã số thuế:
            </label>
            <input
              type="text"
              value={partyB.taxNumber}
              onChange={(e) => handleChangePartyB('taxNumber', e.target.value)}
              className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Người đại diện:
          </label>
          <input
            type="text"
            value={partyB.representative}
            onChange={(e) =>
              handleChangePartyB('representative', e.target.value)
            }
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Chức vụ:</label>
          <input
            type="text"
            value={partyB.position}
            onChange={(e) => handleChangePartyB('position', e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ConsultingContractForm;
