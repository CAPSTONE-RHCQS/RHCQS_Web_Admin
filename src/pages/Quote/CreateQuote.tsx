import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import DeleteButton from '../../components/Buttonicons/DeleteButton';
import SelectGroupTwo from '../../components/Forms/SelectGroup/SelectGroupTwo';

const CreateContract = () => {
  const [customerName, setCustomerName] = useState('');
  const [constructionAddress, setConstructionAddress] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [designArea, setDesignArea] = useState('');
  const [items, setItems] = useState([
    { hangMuc: '', dTich: '', heSo: '', dienTich: '', donVi: '' },
  ]);

  const unitPriceOptions = [
    { value: '3350000', label: '3,350,000 đồng/m²' },
    { value: '3500000', label: '3,500,000 đồng/m²' },
    { value: '3700000', label: '3,700,000 đồng/m²' },
  ];

  const unitOptions = [
    { value: 'm²', label: 'm²' },
    { value: 'm³', label: 'm³' },
    { value: 'kg', label: 'kg' },
    { value: 'tấn', label: 'tấn' },
  ];

  const hangMucOptions = [
    { value: '', label: 'Chọn hạng mục', disabled: true },
    { value: 'Móng', label: 'Móng' },
    { value: 'Hầm (DTSD >= 70m2: độ sâu 1,0m -> 1,3m)', label: 'Hầm' },
    { value: 'Trệt', label: 'Trệt' },
    { value: 'Sân', label: 'Sân' },
    { value: 'Lầu 1', label: 'Lầu 1' },
    { value: 'Thông Tầng Lầu 1 (Thông tầng > 8m2)', label: 'Thông Tầng Lầu 1' },
    { value: 'Sân thượng có mái che', label: 'Sân thượng có mái che' },
    { value: 'Sân thượng không mái che', label: 'Sân thượng không mái che' },
    { value: 'Mái che (Mái BTCT)', label: 'Mái che (Mái BTCT)' },
  ];

  const handleAddItem = () => {
    setItems([
      ...items,
      { hangMuc: '', dTich: '', heSo: '', dienTich: '', donVi: '' },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleChangeItem = (index: number, field: string, value: string) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic xử lý khi người dùng nhấn nút tạo hợp đồng
    console.log({
      customerName,
      constructionAddress,
      unitPrice,
      designArea,
      items,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo Hợp Đồng</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
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
        </div>
        <div>
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
                  <label className="block text-lg font-medium">
                    Hạng mục {index + 1}
                  </label>
                  <DeleteButton onClick={() => handleRemoveItem(index)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <SelectGroupTwo
                    options={hangMucOptions}
                    selectedOption={item.hangMuc}
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
                    selectedOption={item.donVi || 'm²'}
                    onChange={(value) =>
                      handleChangeItem(index, 'donVi', value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded w-full"
          >
            Tạo hợp đồng
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateContract;
