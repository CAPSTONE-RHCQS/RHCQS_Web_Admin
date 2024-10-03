import React, { useState } from 'react';

const UploadDesignDrawing = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previewUrls);
  };

  const handleUpload = () => {
    // Logic to handle file upload
    console.log('Files to upload:', files);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Bản vẽ thiết kế: Phối cảnh (version 1.0)</h2>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
            <span>Phối cảnh</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>Kiến trúc</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>Kết cấu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span>Điện & nước</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-2">Tải bản vẽ phối cảnh</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleUpload}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Tải ảnh
          </button>
          <p className="mt-2">Tổng số tệp: {files.length}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full h-64 bg-gray-100 border rounded flex items-center justify-center">
            {previewImages.length > 0 ? (
              <img src={previewImages[0]} alt="Preview" className="h-full" />
            ) : (
              <span>Chưa có ảnh</span>
            )}
          </div>
          <div className="flex mt-4 space-x-2">
            {previewImages.slice(1).map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                className="w-20 h-20 border rounded"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default UploadDesignDrawing;
