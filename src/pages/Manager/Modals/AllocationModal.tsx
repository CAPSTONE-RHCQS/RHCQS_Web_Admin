import React from 'react';

interface AllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AllocationModal: React.FC<AllocationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Phân bổ</h2>
        {/* Nội dung form phân bổ */}
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default AllocationModal;
