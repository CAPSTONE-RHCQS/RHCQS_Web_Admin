import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  addImageHouseTemplate,
  fetchHouseTemplateDetail,
  uploadSubHouseTemplate,
} from '../../../../api/HouseTemplate/HouseTemplateApi';
import {
  CreatePackageFinished,
  HouseTemplateDetail as HouseTemplateDetailType,
} from '../../../../types/HouseTemplateTypes';
import Alert from '../../../../components/Alert';

const AddImageHouse: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const responseData = location.state?.responseData;
  console.log('Response data:', responseData);
  const packageFinished = location.state?.packageFinished;
  console.log('Package finished:', packageFinished);
  const [overallImage, setOverallImage] = useState<File | null>(null);
  const [outsideImages, setOutsideImages] = useState<File[]>([]);
  const [houseTemplate, setHouseTemplate] =
    useState<HouseTemplateDetailType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [designDrawingImages, setDesignDrawingImages] = useState<File[]>([]);
  const [packageFinishedImages, setPackageFinishedImages] = useState<File[]>(
    [],
  );
  const [previewOverallImage, setPreviewOverallImage] = useState<string | null>(
    null,
  );
  const [previewOutsideImages, setPreviewOutsideImages] = useState<string[]>(
    [],
  );
  const [previewDesignDrawingImages, setPreviewDesignDrawingImages] = useState<
    string[]
  >([]);
  const [previewPackageFinishedImages, setPreviewPackageFinishedImages] =
    useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [subTemplateImages, setSubTemplateImages] = useState<{
    [key: string]: File | null;
  }>({});
  const [previewSubTemplateImages, setPreviewSubTemplateImages] = useState<{
    [key: string]: string | null;
  }>({});

  useEffect(() => {
    const loadHouseTemplateDetail = async () => {
      try {
        if (responseData) {
          const data = await fetchHouseTemplateDetail(responseData);
          setHouseTemplate(data);
        } else if (id) {
          const data = await fetchHouseTemplateDetail(id);
          setHouseTemplate(data);
        }
      } catch (err) {
        setError('Failed to fetch house template detail');
      } finally {
        setLoading(false);
      }
    };

    loadHouseTemplateDetail();
  }, [responseData]);

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

  const handlePackageFinishedImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPreviews = [...previewPackageFinishedImages];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviewPackageFinishedImages(newPreviews);

      const newImages = [...packageFinishedImages];
      newImages[index] = file;
      setPackageFinishedImages(newImages);
    }
  };

  const handleSubTemplateImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    subTemplateId: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSubTemplateImages((prev) => ({ ...prev, [subTemplateId]: file }));
      setPreviewSubTemplateImages((prev) => ({
        ...prev,
        [subTemplateId]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    if (responseData && overallImage) {
      setIsLoading(true);
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

        packageFinishedImages.forEach((image) => {
          formData.append('PackageFinishedImage', image, image.name);
        });

        if (packageFinished) {
          const packageJsonString = JSON.stringify(
            packageFinished.map((pkg: CreatePackageFinished) => ({
              packageId: pkg.packageId,
              description: pkg.description,
            })),
          );
          formData.append('packageJson', packageJsonString);
          console.log('Package JSON string:', packageJsonString);
        }

        // Kiểm tra tất cả các SubTemplate đã có ảnh
        const allSubTemplateImagesSelected = houseTemplate?.SubTemplates.every(
          (subTemplate) => subTemplateImages[subTemplate.Id] !== undefined,
        );

        // Kiểm tra tất cả các packageFinished đã có ảnh
        const allPackageImagesSelected =
          packageFinishedImages.length === packageFinished.length;

        if (!allSubTemplateImagesSelected || !allPackageImagesSelected) {
          setAlert({
            message: 'Vui lòng chọn ảnh cho tất cả các diện tích và gói.',
            type: 'error',
          });
          return;
        }

        // Gửi ảnh cho từng SubTemplate
        for (const subTemplate of houseTemplate?.SubTemplates || []) {
          const image = subTemplateImages[subTemplate.Id];
          const subFormData = new FormData();
          if (image) {
            subFormData.append('request', image, image.name);
          }
          await uploadSubHouseTemplate(subTemplate.Id, subFormData);
        }

        const result = await addImageHouseTemplate(responseData, formData);
        console.log('Package finished images:', packageFinishedImages);
        console.log('Image uploaded successfully:', result, formData);
        setAlert({
          message: 'Hình ảnh đã được gửi thành công!',
          type: 'success',
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        console.log('Package finished data:', packageFinished);
        setAlert({ message: 'Có lỗi xảy ra khi gửi hình ảnh.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setAlert({
        message: 'Vui lòng chọn ít nhất một hình ảnh để gửi.',
        type: 'error',
      });
    }
  };

  const removeImage = (
    index: number,
    type: 'overall' | 'outside' | 'design' | 'package',
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
    } else if (type === 'package') {
      const newPackageFinishedImages = [...packageFinishedImages];
      const newPreviewPackageFinishedImages = [...previewPackageFinishedImages];
      newPackageFinishedImages.splice(index, 1);
      newPreviewPackageFinishedImages.splice(index, 1);
      setPackageFinishedImages(newPackageFinishedImages);
      setPreviewPackageFinishedImages(newPreviewPackageFinishedImages);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4 text-black">
        Tên nhà mẫu: {houseTemplate?.Name}
      </h3>
      <div>
        <h2 className="text-2xl font-bold mb-4">Hình ảnh tổng thể</h2>
        <div className="flex flex-wrap items-center rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6 ">
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
        <h2 className="text-2xl font-bold mb-4 mt-4">Ảnh ngoại cảnh</h2>
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
        <h2 className="text-2xl font-bold mb-4 mt-4">Bản vẽ</h2>
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

      <div>
        <h2 className="text-2xl font-bold mb-4 mt-4">Kích thước mẫu nhà</h2>
        <div className="flex space-x-4">
          {houseTemplate?.SubTemplates.map((subTemplate) => (
            <div
              key={subTemplate.Id}
              className="flex flex-col items-center justify-between border border-stroke rounded-lg p-4 w-1/3 bg-white"
            >
              <h3 className="text-lg font-bold mb-2">
                Diện tích: {subTemplate.Size}
              </h3>
              {previewSubTemplateImages[subTemplate.Id] ? (
                <div className="relative">
                  <img
                    src={previewSubTemplateImages[subTemplate.Id] as string}
                    alt={`SubTemplate Preview ${subTemplate.Id}`}
                    style={{
                      width: '150px',
                      height: '100px',
                      marginBottom: '10px',
                    }}
                  />
                  <button
                    onClick={() => {
                      setSubTemplateImages((prev) => ({
                        ...prev,
                        [subTemplate.Id]: null,
                      }));
                      setPreviewSubTemplateImages((prev) => ({
                        ...prev,
                        [subTemplate.Id]: null,
                      }));
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center w-36 h-24 border-2 border-dashed rounded-md mt-2">
                  <span className="text-3xl">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleSubTemplateImageChange(e, subTemplate.Id)
                    }
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 mt-4">Ảnh gói hoàn thiện</h2>
        <div className="flex space-x-4">
          {packageFinished.map((pkg: CreatePackageFinished, index: number) => (
            <div
              key={pkg.packageId}
              className="flex flex-col items-center justify-between border border-stroke rounded-lg p-4 w-1/4 bg-white"
            >
              <h3 className="text-lg font-bold mb-2">{pkg.description}</h3>
              {previewPackageFinishedImages[index] ? (
                <div className="relative">
                  <img
                    src={previewPackageFinishedImages[index]}
                    alt={`Package Finished Preview ${index}`}
                    style={{
                      width: '150px',
                      height: '100px',
                      marginBottom: '10px',
                    }}
                  />
                  <button
                    onClick={() => removeImage(index, 'package')}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    -
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center w-36 h-24 border-2 border-dashed rounded-md">
                  <span className="text-3xl">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handlePackageFinishedImagesChange(e, index)
                    }
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="mt-4 bg-primary text-white py-2 px-4 rounded flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            'Cập nhật hình ảnh'
          )}
        </button>
      </div>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default AddImageHouse;
