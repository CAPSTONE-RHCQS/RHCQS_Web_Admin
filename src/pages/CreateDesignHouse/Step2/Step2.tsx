import React, { useState, useEffect } from 'react';
import Modal from '../../../components/Modal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import 'react-medium-image-zoom/dist/styles.css';

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
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    index: number;
  } | null>(null);
  const [totalFiles, setTotalFiles] = useState<number>(0);

  useEffect(() => {
    setTotalFiles(
      exteriorImages.length + interiorImages.length + floorPlanImages.length,
    );
  }, [exteriorImages, interiorImages, floorPlanImages]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImages: (files: File[]) => void,
    images: File[],
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setImages([...images, ...filesArray]);
    }
  };

  const handleRemoveImage = (
    index: number,
    images: File[],
    setImages: (files: File[]) => void,
  ) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const renderPreview = (
    images: File[],
    setImages: (files: File[]) => void,
  ) => {
    return images.map((image, index) => (
      <div key={index} className="relative m-2">
        <img
          src={URL.createObjectURL(image)}
          alt={`preview-${index}`}
          className="w-32 h-32 object-cover cursor-pointer"
          onClick={() =>
            setSelectedImage({ src: URL.createObjectURL(image), index })
          }
        />
        <span className="absolute top-1 left-1 bg-gray-800 text-white text-xs rounded-full px-2 py-1 z-10">
          {index + 1}
        </span>
        <button
          onClick={() => handleRemoveImage(index, images, setImages)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-700 transition z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-lg font-medium mb-2">
          Tải lên hình ảnh Phối cảnh:
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            handleFileChange(e, setExteriorImages, exteriorImages)
          }
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <div className="flex flex-wrap mt-4">
          {renderPreview(exteriorImages, setExteriorImages)}
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">
          Tải lên bản vẽ Kiến trúc:
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            handleFileChange(e, setFloorPlanImages, floorPlanImages)
          }
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <div className="flex flex-wrap mt-4">
          {renderPreview(floorPlanImages, setFloorPlanImages)}
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">
          Tải lên bản vẽ Kết cấu:
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            handleFileChange(e, setFloorPlanImages, floorPlanImages)
          }
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <div className="flex flex-wrap mt-4">
          {renderPreview(floorPlanImages, setFloorPlanImages)}
        </div>
      </div>

      <div>
        <label className="block text-lg font-medium mb-2">
          Tải lên bản vẽ Điện & Nước:
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            handleFileChange(e, setFloorPlanImages, floorPlanImages)
          }
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        <div className="flex flex-wrap mt-4">
          {renderPreview(floorPlanImages, setFloorPlanImages)}
        </div>
      </div>

      <div className="mt-4">
        <span className="text-sm text-gray-500">Tổng số tệp: {totalFiles}</span>
      </div>
      {selectedImage && (
        <Modal onClose={() => setSelectedImage(null)}>
          <div className="flex justify-center items-center relative">
            <span className="absolute top-2 left-2 bg-gray-800 text-white text-xs rounded-full px-2 py-1 z-50">
              {selectedImage.index + 1}
            </span>
            <TransformWrapper>
              <TransformComponent>
                <img
                  src={selectedImage.src}
                  alt={`Selected ${selectedImage.index + 1}`}
                  className="max-w-full max-h-full"
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Step2;
