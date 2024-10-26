import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { postPromotion } from '../../../../api/Promotion/PromotionApi';
import { PromotionRequest } from '../../../../types/PromotionTypes';

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}

const AddPromotionModal: React.FC<AddPromotionModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [expTime, setExpTime] = useState('');

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName('');
    setValue(0);
    setStartTime('');
    setExpTime('');
  };

  const handleSubmit = async () => {
    try {
      if (!name || !startTime || !expTime) {
        toast.error('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      const promotionData: PromotionRequest = {
        name,
        value,
        startTime,
        expTime,
      };

      await postPromotion(promotionData);
      toast.success('Thêm mới thành công!');
      onAddSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Thêm mới thất bại!');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Thêm mới Promotion
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
          <input
            type="number"
            placeholder="Giá trị"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
          <input
            type="datetime-local"
            placeholder="Thời gian bắt đầu"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
          <input
            type="datetime-local"
            placeholder="Thời gian kết thúc"
            value={expTime}
            onChange={(e) => setExpTime(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-2 bg-gray-300 rounded mr-2 hover:bg-gray-400 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPromotionModal;
