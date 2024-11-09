import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addImageHouseTemplate } from '../../../../api/HouseTemplate/HouseTemplateApi';

const AddImageHouse: React.FC = () => {
  const location = useLocation();
  const responseData = location.state?.responseData;

  const [overallImage, setOverallImage] = useState<File | null>(null);
  const [outsideImages, setOutsideImages] = useState<File[]>([]);
  const [designDrawingImages, setDesignDrawingImages] = useState<File[]>([]);
  const [previewOverallImage, setPreviewOverallImage] = useState<string | null>(
    null,
  );
  const [previewOutsideImages, setPreviewOutsideImages] = useState<string[]>(
    [],
  );
  const [previewDesignDrawingImages, setPreviewDesignDrawingImages] = useState<
    string[]
  >([]);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null,
  );

  const handleOverallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOverallImage(file);
      setPreviewOverallImage(URL.createObjectURL(file));
    }
  };

  const handleOutsideImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setOutsideImages((prevImages) => [...prevImages, ...files]);
      setPreviewOutsideImages((prevPreviews) => [
        ...prevPreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleDesignDrawingImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setDesignDrawingImages((prevImages) => [...prevImages, ...files]);
      setPreviewDesignDrawingImages((prevPreviews) => [
        ...prevPreviews,
        ...files.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleSubmit = async () => {
    if (responseData && overallImage) {
      try {
        const formData = new FormData();

        // Thêm OverallImage
        formData.append('OverallImage', overallImage, overallImage.name);

        // Thêm OutSideImage dưới dạng mảng
        outsideImages.forEach((image) => {
          formData.append('OutSideImage', image, image.name);
        });

        // Thêm DesignDrawingImage dưới dạng mảng
        designDrawingImages.forEach((image) => {
          formData.append('DesignDrawingImage', image, image.name);
        });

        const result = await addImageHouseTemplate(responseData, formData);
        console.log('Image uploaded successfully:', result);
        setConfirmationMessage('Hình ảnh đã được gửi thành công!');
      } catch (error) {
        console.error('Error uploading image:', error);
        setConfirmationMessage('Có lỗi xảy ra khi gửi hình ảnh.');
      }
    }
  };

  const removeImage = (
    index: number,
    type: 'overall' | 'outside' | 'design',
  ) => {
    if (type === 'overall') {
      setOverallImage(null);
      setPreviewOverallImage(null);
    } else if (type === 'outside') {
      const newOutsideImages = [...outsideImages];
      const newPreviewOutsideImages = [...previewOutsideImages];
      newOutsideImages.splice(index, 1);
      newPreviewOutsideImages.splice(index, 1);
      setOutsideImages(newOutsideImages);
      setPreviewOutsideImages(newPreviewOutsideImages);
    } else if (type === 'design') {
      const newDesignDrawingImages = [...designDrawingImages];
      const newPreviewDesignDrawingImages = [...previewDesignDrawingImages];
      newDesignDrawingImages.splice(index, 1);
      newPreviewDesignDrawingImages.splice(index, 1);
      setDesignDrawingImages(newDesignDrawingImages);
      setPreviewDesignDrawingImages(newPreviewDesignDrawingImages);
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-black">
          Hình ảnh tổng thể
        </h2>
        <div className="flex flex-wrap items-center rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          {previewOverallImage ? (
            <div className="relative group">
              <img
                src={previewOverallImage}
                alt="Overall Preview"
                style={{
                  width: '150px',
                  height: '100px',
                  marginRight: '10px',
                  marginBottom: '10px',
                }}
              />
              <button
                onClick={() => removeImage(0, 'overall')}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                -
              </button>
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-opacity-50 bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOverallImageChange}
                  style={{ display: 'none' }}
                />
                <span className="text-3xl">+</span>
              </label>
            </div>
          ) : (
            <label className="cursor-pointer flex items-center justify-center w-36 h-24 border-2 border-dashed rounded-md">
              <span className="text-3xl">+</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleOverallImageChange}
                style={{ display: 'none' }}
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 mt-4 text-black">
          Ảnh ngoại cảnh
        </h2>
        <div className="flex flex-wrap items-center rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          {previewOutsideImages.map((src, index) => (
            <div key={index} className="relative">
              <img
                src={src}
                alt={`Outside Preview ${index}`}
                style={{
                  width: '150px',
                  height: '100px',
                  marginRight: '10px',
                  marginBottom: '10px',
                }}
              />
              <button
                onClick={() => removeImage(index, 'outside')}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                -
              </button>
            </div>
          ))}
          <label className="cursor-pointer flex items-center justify-center w-36 h-24 border-2 border-dashed rounded-md">
            <span className="text-3xl">+</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleOutsideImagesChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 mt-4 text-black">Bản vẽ</h2>
        <div className="flex flex-wrap items-center rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-5">
          {previewDesignDrawingImages.map((src, index) => (
            <div key={index} className="relative">
              <img
                src={src}
                alt={`Design Drawing Preview ${index}`}
                style={{
                  width: '150px',
                  height: '100px',
                  marginRight: '10px',
                  marginBottom: '10px',
                }}
              />
              <button
                onClick={() => removeImage(index, 'design')}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                -
              </button>
            </div>
          ))}
          <label className="cursor-pointer flex items-center justify-center w-36 h-24 border-2 border-dashed rounded-md">
            <span className="text-3xl">+</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleDesignDrawingImagesChange}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-primary text-white py-2 px-4 rounded"
      >
        Gửi
      </button>

      {confirmationMessage && <div className="mt-4">{confirmationMessage}</div>}
    </div>
  );
};

export default AddImageHouse;
