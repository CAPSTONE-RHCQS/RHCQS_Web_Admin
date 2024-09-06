import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';

const CreateContract = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customerName, setCustomerName] = useState<string>('');
  const [constructionAddress, setConstructionAddress] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [designArea, setDesignArea] = useState<string>('');
  const [items, setItems] = useState([
    { hangMuc: '', dTich: '', heSo: '', dienTich: '', donVi: '' },
  ]);
  const [landArea, setLandArea] = useState<number>(0); // Đổi thành number
  const [constructionArea, setConstructionArea] = useState<number>(0); // Đổi thành number
  const [numberOfFloors, setNumberOfFloors] = useState<number>(1); // Đổi thành number

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

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo Hợp Đồng</h2>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <Step1
            customerName={customerName}
            setCustomerName={setCustomerName}
            constructionAddress={constructionAddress}
            setConstructionAddress={setConstructionAddress}
            unitPrice={unitPrice}
            setUnitPrice={setUnitPrice}
            unitPriceOptions={unitPriceOptions}
            landArea={landArea}
            setLandArea={setLandArea}
            constructionArea={constructionArea}
            setConstructionArea={setConstructionArea}
            numberOfFloors={numberOfFloors}
            setNumberOfFloors={setNumberOfFloors}
          />
        )}
        {currentStep === 2 && (
          <Step2
            items={items}
            hangMucOptions={hangMucOptions}
            unitOptions={unitOptions}
            handleAddItem={handleAddItem}
            handleRemoveItem={handleRemoveItem}
            handleChangeItem={handleChangeItem}
          />
        )}
        <div className="col-span-1 md:col-span-2 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-secondary hover:bg-opacity-90 text-white px-4 py-2 rounded"
            >
              Quay lại
            </button>
          )}
          {currentStep < 2 && (
            <button
              type="button"
              onClick={nextStep}
              className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
            >
              Tiếp theo
            </button>
          )}
          {currentStep === 2 && (
            <button
              type="submit"
              className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
            >
              Tạo hợp đồng
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateContract;
