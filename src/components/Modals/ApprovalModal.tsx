import React from 'react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Phê duyệt</h2>
        {/* Nội dung form phê duyệt */}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ApprovalModal;
