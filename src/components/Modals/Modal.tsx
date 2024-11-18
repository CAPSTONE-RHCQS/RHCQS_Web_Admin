import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode; // Thêm thuộc tính children
}

const Modal: React.FC<ModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
  children,
}) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        {children && <div className="mb-4">{children}</div>}
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
          >
            Có
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
