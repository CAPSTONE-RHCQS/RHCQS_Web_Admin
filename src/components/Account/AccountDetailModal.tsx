import React, { useState } from 'react';
import { updateAccount, updateDeflag } from '../../api/Account/Account';
import RejectionModal from '../Modals/RejectionModal';

interface AccountDetailModalProps {
  account: {
    id: string;
    roleId: string;
    email: string;
    username: string;
    imageUrl: string;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    insDate: string;
    upsDate: string;
  };
  onClose: () => void;
}

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState(account);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedAccount({ ...editedAccount, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateAccount(editedAccount);
      onClose();
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeflag = async (reason: string) => {
    try {
      await updateDeflag(account.id, reason);
      alert('Khóa tài khoản thành công');
      onClose();
    } catch (error) {
      console.error('Error updating deflag:', error);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        onClick={handleOutsideClick}
      >
        <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/2">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h2 className="text-xl font-bold mb-4">Thông tin chi tiết</h2>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>
                  <strong>ID:</strong>
                  <input
                    type="text"
                    name="id"
                    value={editedAccount.id}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    readOnly
                  />
                </label>
                <label>
                  <strong>Role ID:</strong>
                  <input
                    type="text"
                    name="roleId"
                    value={editedAccount.roleId}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Email:</strong>
                  <input
                    type="text"
                    name="email"
                    value={editedAccount.email}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Username:</strong>
                  <input
                    type="text"
                    name="username"
                    value={editedAccount.username}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
              </div>
              <div>
                <label>
                  <strong>Image URL:</strong>
                  <input
                    type="text"
                    name="imageUrl"
                    value={editedAccount.imageUrl}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Phone Number:</strong>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={editedAccount.phoneNumber || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Date of Birth:</strong>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={editedAccount.dateOfBirth || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>ID:</strong> {account.id}
                </p>
                <p>
                  <strong>Role ID:</strong> {account.roleId}
                </p>
                <p>
                  <strong>Email:</strong> {account.email}
                </p>
                <p>
                  <strong>Username:</strong> {account.username}
                </p>
              </div>
              <div>
                <p>
                  <strong>Image URL:</strong>
                </p>
                <img
                  src={account.imageUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
                <p>
                  <strong>Phone Number:</strong> {account.phoneNumber || 'N/A'}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {account.dateOfBirth || 'N/A'}
                </p>
              </div>
            </div>
          )}
          <div className="mt-4">
            <p>
              <strong>Insert Date:</strong> {account.insDate}
            </p>
            <p>
              <strong>Update Date:</strong> {account.upsDate}
            </p>
          </div>
          {isEditing ? (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Lưu
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setShowRejectionModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Khóa tài khoản
              </button>
            </div>
          )}
        </div>
      </div>
      {showRejectionModal && (
        <RejectionModal
          title="Xác nhận khóa tài khoản"
          message="Bạn có chắc chắn muốn khóa tài khoản này không? Vui lòng nhập lý do."
          onConfirm={(reason) => {
            handleDeflag(reason);
            setShowRejectionModal(false);
          }}
          onCancel={() => setShowRejectionModal(false)}
        />
      )}
    </>
  );
};

export default AccountDetailModal;
