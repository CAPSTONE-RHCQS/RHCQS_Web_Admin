import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  approvalType: string;
  setApprovalType: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  onSubmit: () => Promise<void>;
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  isOpen,
  onClose,
  approvalType,
  setApprovalType,
  reason,
  setReason,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-8 rounded shadow-lg w-full max-w-md md:max-w-lg lg:max-w-xl">
          <Dialog.Title className="text-2xl font-bold">
            Phê duyệt
          </Dialog.Title>
          <div className="mt-6">
            <select
              value={approvalType}
              onChange={(e) => setApprovalType(e.target.value)}
              className="mt-2 p-2.5 block w-full border border-gray-300 rounded-md shadow-sm text-lg"
            >
              <option value="Approved">Chấp nhận</option>
              <option value="Rejected">Từ chối</option>
            </select>
          </div>
          <div className="mt-6">
            <label className="block text-lg font-medium text-gray-700">
              Lý do
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm text-lg"
              rows={4}
            />
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded text-lg transition-colors duration-200"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className={`bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded text-lg transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ApprovalDialog; 