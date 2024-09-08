import React, { useState } from 'react';
import Modal from '../../../components/Modal';

interface Step2Props {
  exteriorImages: File[];
  setExteriorImages: (files: File[]) => void;
  interiorImages: File[];
  setInteriorImages: (files: File[]) => void;
  floorPlanImages: File[];
  setFloorPlanImages: (files: File[]) => void;
}

const Step2: React.FC<Step2Props> = ({
  exteriorImages,
  setExteriorImages,
  interiorImages,
  setInteriorImages,
  floorPlanImages,
  setFloorPlanImages,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setImages: (files: File[]) => void) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImages(filesArray);
    }
  };

  const renderPreview = (images: File[]) => {
    return images.map((image, index) => (
      <img
        key={index}
        src={URL.createObjectURL(image)}
        alt={`preview-${index}`}
        className="w-32 h-32 object-cover m-2 cursor-pointer"
        onClick={() => setSelectedImage(URL.createObjectURL(image))}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium mb-2">Tải lên hình ảnh ngoại thất:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e, setExteriorImages)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <div className="flex flex-wrap mt-4">{renderPreview(exteriorImages)}</div>
      </div>
      <div>
        <label className="block text-lg font-medium mb-2">Tải lên hình ảnh nội thất:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e, setInteriorImages)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <div className="flex flex-wrap mt-4">{renderPreview(interiorImages)}</div>
      </div>
      <div>
        <label className="block text-lg font-medium mb-2">Tải lên bản vẽ mặt bằng:</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileChange(e, setFloorPlanImages)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <div className="flex flex-wrap mt-4">{renderPreview(floorPlanImages)}</div>
      </div>
      {selectedImage && (
        <Modal
          onClose={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Selected" className="w-full h-auto" />
        </Modal>
      )}
    </div>
  );
};

export default Step2;
