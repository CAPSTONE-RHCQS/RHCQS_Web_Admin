import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface RejectionModalProps {
  title: string;
  message: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

const RejectionModal: React.FC<RejectionModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full mt-4 p-2 border rounded"
          placeholder="Nhập lý do từ chối..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded mr-2"
          >
            No
          </button>
          <button
            onClick={handleConfirm}
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded"
          >
            Yes
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default RejectionModal;
