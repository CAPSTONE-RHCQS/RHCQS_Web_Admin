import React, { useState } from 'react';

const CreateContractDesign = () => {
  const [partyA, setPartyA] = useState({
    investor: '',
    address: '',
    phone: '',
    fax: '',
  });

  const [partyB, setPartyB] = useState({
    consultingCompany: '',
    representativeOffice: '',
    phone: '',
    fax: '',
    accountNumber: '',
    taxNumber: '',
    representative: '',
    position: '',
  });

  const [contractDetails, setContractDetails] = useState({
    constructionArea: '',
    designUnitPrice: '',
    contractValue: '',
    payment1: '',
    payment2: '',
  });

  const handleChangePartyA = (field: string, value: string) => {
    setPartyA({ ...partyA, [field]: value });
  };

  const handleChangePartyB = (field: string, value: string) => {
    setPartyB({ ...partyB, [field]: value });
  };

  const handleChangeContractDetails = (field: string, value: string) => {
    setContractDetails({ ...contractDetails, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic xử lý khi người dùng nhấn nút lưu
    console.log({ partyA, partyB, contractDetails });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo hợp đồng</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Bên A (Bên giao thi công)
            </h3>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Chủ đầu tư:
              </label>
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
              <label className="block text-lg font-medium mb-2">
                Điện thoại:
              </label>
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
              <label className="block text-lg font-medium mb-2">
                Điện thoại:
              </label>
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
                  onChange={(e) =>
                    handleChangePartyB('taxNumber', e.target.value)
                  }
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

        <hr className="my-4 border-gray-300" />

        <h3 className="text-xl font-semibold mb-4">
          Giá trị hợp đồng & Phương thức thanh toán
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Diện tích xây dựng:
              </label>
              <input
                type="text"
                value={contractDetails.constructionArea}
                onChange={(e) =>
                  handleChangeContractDetails(
                    'constructionArea',
                    e.target.value,
                  )
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
                Đợt 1: ~50% tổng giá trị của hợp đồng ngay sau khi ký kết hợp
                đồng
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
                Đợt 2: ~50% tổng giá trị của hợp đồng vào thời điểm khi bên B
                bàn giao toàn bộ hồ sơ thiết kế kỹ thuật
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
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContractDesign;
