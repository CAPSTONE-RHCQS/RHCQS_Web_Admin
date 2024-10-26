import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { putPromotion } from '../../../../../api/Promotion/PromotionApi';
import { PromotionItem } from '../../../../../types/PromotionTypes';

interface EditPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  promotion: PromotionItem;
}

const EditPromotionModal: React.FC<EditPromotionModalProps> = ({
  isOpen,
  onClose,
  onEditSuccess,
  promotion,
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [expTime, setExpTime] = useState('');

  useEffect(() => {
    if (isOpen && promotion) {
      setName(promotion.Name);
      setValue(promotion.Value);
      setStartTime(promotion.StartTime);
      setExpTime(promotion.ExpTime);
    }
  }, [isOpen, promotion]);

  const handleSubmit = async () => {
    try {
      const promotionData = {
        name,
        value,
        startTime,
        expTime,
      };

      if (
        name !== promotion.Name ||
        value !== promotion.Value ||
        startTime !== promotion.StartTime ||
        expTime !== promotion.ExpTime
      ) {
        await putPromotion(promotion.Id, promotionData);
        toast.success('Chỉnh sửa thành công!');
        onEditSuccess();
      } else {
        toast.info('Không có thay đổi nào được thực hiện.');
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Chỉnh sửa thất bại!');
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
          Chỉnh sửa Promotion
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
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPromotionModal;
