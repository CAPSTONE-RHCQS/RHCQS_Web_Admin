import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2/Step2';
import sampleData from '../../../data/sampleData.json'; // Import dữ liệu mẫu

const CreateQuote = () => {
  const [customerName, setCustomerName] = useState<string>('');
  const [constructionAddress, setConstructionAddress] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
  const [designArea, setDesignArea] = useState<string>('');
  const [items, setItems] = useState([
    { hangMuc: 'Móng', dTich: '', heSo: '', dienTich: '', donVi: 'm²' },
    { hangMuc: 'Trệt', dTich: '', heSo: '', dienTich: '', donVi: 'm²' },
    { hangMuc: 'Sân', dTich: '', heSo: '', dienTich: '', donVi: 'm²' },
  ]);
  const [tab2Items, setTab2Items] = useState([
    {
      name: 'Chi phí thi công sàn nhỏ hơn 70m²',
      totalCost: 0,
      quantity: 0,
      coefficient: 0,
      totalAmount: 0,
      enabled: false,
    },
    {
      name: 'Chi phí thi công công trình hẻm nhỏ',
      totalCost: 0,
      quantity: 0,
      coefficient: 0,
      totalAmount: 0,
      enabled: false,
    },
    {
      name: 'Hỗ trợ bãi tập kết, điều kiện thi công khó khăn',
      totalCost: 0,
      quantity: 0,
      coefficient: 0,
      totalAmount: 0,
      enabled: false,
    },
    {
      name: 'Chi phí thi công nhà 2 mặt tiền trở lên',
      totalCost: 0,
      quantity: 0,
      coefficient: 0,
      totalAmount: 0,
      enabled: false,
    },
    {
      name: 'Chi phí thi công công trình tỉnh',
      totalCost: 0,
      quantity: 0,
      coefficient: 0,
      totalAmount: 0,
      enabled: false,
    },
  ]);
  const [landArea, setLandArea] = useState<number>(0);
  const [constructionArea, setConstructionArea] = useState<number>(0);
  const [numberOfFloors, setNumberOfFloors] = useState<number>(1);

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
    { value: 'Hầm', label: 'Hầm (DTSD >= 70m²: độ sâu 1,0m -> 1,3m)' },
    { value: 'Trệt', label: 'Trệt' },
    { value: 'Sân', label: 'Sân' },
    { value: 'Lầu 1', label: 'Lầu 1' },
    { value: 'Thông Tầng Lầu 1', label: 'Thông Tầng Lầu 1 (Thông tầng > 8m²)' },
    { value: 'Lầu 2', label: 'Lầu 2' },
    { value: 'Thông Tầng Lầu 2', label: 'Thông Tầng Lầu 2 (Thông tầng > 8m²)' },
    { value: 'Lầu 3', label: 'Lầu 3' },
    { value: 'Thông Tầng Lầu 3', label: 'Thông Tầng Lầu 3 (Thông tầng > 8m²)' },
    { value: 'Lầu 4', label: 'Lầu 4' },
    { value: 'Thông Tầng Lầu 4', label: 'Thông Tầng Lầu 4 (Thông tầng > 8m²)' },
    { value: 'Lầu 5', label: 'Lầu 5' },
    { value: 'Thông Tầng Lầu 5', label: 'Thông Tầng Lầu 5 (Thông tầng > 8m²)' },
    { value: 'Lầu 6', label: 'Lầu 6' },
    { value: 'Thông Tầng Lầu 6', label: 'Thông Tầng Lầu 6 (Thông tầng > 8m²)' },
    { value: 'Sân thượng có mái che', label: 'Sân thượng có mái che' },
    { value: 'Sân thượng không mái che', label: 'Sân thượng không mái che' },
    { value: 'Mái che (Mái BTCT)', label: 'Mái che (Mái BTCT)' },
    { value: 'Tầng lửng', label: 'Tầng lửng' },
    { value: 'Tầng thượng', label: 'Tầng thượng' },
    { value: 'Mái', label: 'Mái' },
    { value: 'Mái phụ', label: 'Mái phụ' },
    { value: 'Phòng kỹ thuật thang máy', label: 'Phòng kỹ thuật thang máy' },
    { value: 'Hố PIT', label: 'Hố PIT' },
  ];

  useEffect(() => {
    // Tải dữ liệu mẫu khi trang được tải
    setCustomerName(sampleData.customerName);
    setConstructionAddress(sampleData.constructionAddress);
    setUnitPrice(sampleData.unitPrice);
    setDesignArea(sampleData.designArea);
    setItems(sampleData.items);
    setTab2Items(sampleData.tab2Items);
    setLandArea(sampleData.landArea);
    setConstructionArea(sampleData.constructionArea);
    setNumberOfFloors(sampleData.numberOfFloors);
  }, []);

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

  const handleChangeTab2Item = (
    index: number,
    field: string,
    value: number | boolean,
  ) => {
    const newItems = [...tab2Items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field !== 'enabled') {
      newItems[index].totalAmount =
        newItems[index].totalCost *
        newItems[index].quantity *
        newItems[index].coefficient;
    }
    setTab2Items(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic xử lý khi người dùng nhấn nút tạo báo giá
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
      <h2 className="text-2xl font-bold mb-4">Tạo báo giá sơ bộ</h2>
      <form onSubmit={handleSubmit}>
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
        <Step2
          items={items}
          hangMucOptions={hangMucOptions}
          unitOptions={unitOptions}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleChangeItem={handleChangeItem}
          tab2Items={tab2Items}
          handleChangeTab2Item={handleChangeTab2Item}
          setItems={setItems}
        />
        <div className="col-span-1 md:col-span-2 flex justify-between">
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
          >
            Tạo báo giá sơ bộ
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuote;
