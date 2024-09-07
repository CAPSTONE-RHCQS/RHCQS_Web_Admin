import React from 'react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Phê duyệt</h2>
        {/* Nội dung form phê duyệt */}
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default ApprovalModal;
