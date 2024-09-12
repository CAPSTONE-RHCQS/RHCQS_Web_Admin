import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2/Step2';
import Modal from '../../components/Modal'; // Giả sử bạn có một component Modal

const CreateDesignHouse = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [area, setArea] = useState<string>('');
  const [landArea, setLandArea] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [numberOfBedrooms, setNumberOfBedrooms] = useState<number>(1);
  const [numberOfFloors, setNumberOfFloors] = useState<number>(1);

  const [perspectiveImages, setPerspectiveImages] = useState<File[]>([]);
  const [architectureImages, setArchitectureImages] = useState<File[]>([]);
  const [structureImages, setStructureImages] = useState<File[]>([]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic xử lý khi người dùng nhấn nút tạo thiết kế nhà
    console.log({
      area,
      landArea,
      price,
      numberOfBedrooms,
      numberOfFloors,
      perspectiveImages,
      architectureImages,
      structureImages,
    });
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setShowConfirmModal(true);
    } else {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    setCurrentStep(1);
  };

  const handleConfirmNo = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo Thiết Kế Nhà</h2>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <Step1
            area={area}
            setArea={setArea}
            landArea={landArea}
            setLandArea={setLandArea}
            price={price}
            setPrice={setPrice}
            numberOfBedrooms={numberOfBedrooms}
            setNumberOfBedrooms={setNumberOfBedrooms}
            numberOfFloors={numberOfFloors}
            setNumberOfFloors={setNumberOfFloors}
          />
        )}
        {currentStep === 2 && (
          <Step2
            perspectiveImages={perspectiveImages}
            setPerspectiveImages={setPerspectiveImages}
            architectureImages={architectureImages}
            setArchitectureImages={setArchitectureImages}
            structureImages={structureImages}
            setStructureImages={setStructureImages}
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
              Tạo thiết kế nhà
            </button>
          )}
        </div>
      </form>
      {showConfirmModal && (
        <Modal
          title="Xác nhận"
          message="Báo giá chưa được lưu, bạn có chắc chắn muốn quay lại?"
          onClose={handleConfirmNo}
        >
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={handleConfirmNo}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmYes}
              className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Xác nhận
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateDesignHouse;
