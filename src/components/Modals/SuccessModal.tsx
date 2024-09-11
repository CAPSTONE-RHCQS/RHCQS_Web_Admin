import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface SuccessModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ title, message, onConfirm }) => {
  useEffect(() => {
    // Cuộn về đầu trang khi modal hiển thị
    window.scrollTo(0, 0);
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
          >
            OK
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SuccessModal;
