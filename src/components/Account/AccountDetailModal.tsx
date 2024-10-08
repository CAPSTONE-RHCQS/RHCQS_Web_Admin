import React, { useState } from 'react';
import { updateAccount, updateDeflag } from '../../api/Account/Account';
import RejectionModal from '../Modals/RejectionModal';
import { toast } from 'react-toastify';
import Alert from '../Alert';

interface AccountDetailModalProps {
  account: {
    Id: string;
    RoleId: string;
    Email: string;
    Username: string;
    ImageUrl: string;
    PhoneNumber: string | null;
    DateOfBirth: string | null;
    InsDate: string;
    UpsDate: string;
  };
  onClose: () => void;
  onUpdateAccount: (updatedAccount: any) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  onClose,
  onUpdateAccount,
  setRefreshKey,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState({
    Id: account.Id,
    RoleId: account.RoleId,
    Email: account.Email,
    Username: account.Username,
    ImageUrl: account.ImageUrl,
    PasswordHash: '',
    PhoneNumber: account.PhoneNumber,
    DateOfBirth: account.DateOfBirth,
    InsDate: account.InsDate,
    UpsDate: account.UpsDate,
    Deflag: true,
  });
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedAccount({ ...editedAccount, [name]: value });
  };

  const handleSave = async () => {
    if (!editedAccount.PasswordHash) {
      setError('Mật khẩu không được để trống.');
      toast.error('Vui lòng điền mật khẩu.');
      return;
    }

    setIsSaving(true);
    try {
      await updateAccount(editedAccount);
      onUpdateAccount(editedAccount);
      toast.success('Lưu thành công!');
      onClose();
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Có lỗi xảy ra khi lưu tài khoản.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeflag = async (reason: string) => {
    try {
      await updateDeflag(account.Id, reason);
      setAlert({ message: 'Khóa tài khoản thành công', type: 'success' });
      onClose();
    } catch (error) {
      console.error('Error updating deflag:', error);
      setAlert({ message: 'Có lỗi xảy ra khi khóa tài khoản.', type: 'error' });
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
                    name="Id"
                    value={editedAccount.Id}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                    readOnly
                  />
                </label>
                <label>
                  <strong>Role ID:</strong>
                  <input
                    type="text"
                    name="RoleId"
                    value={editedAccount.RoleId}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Email:</strong>
                  <input
                    type="text"
                    name="Email"
                    value={editedAccount.Email}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Username:</strong>
                  <input
                    type="text"
                    name="Username"
                    value={editedAccount.Username}
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
                    name="ImageUrl"
                    value={editedAccount.ImageUrl}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Phone Number:</strong>
                  <input
                    type="text"
                    name="PhoneNumber"
                    value={editedAccount.PhoneNumber || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Date of Birth:</strong>
                  <input
                    type="text"
                    name="DateOfBirth"
                    value={editedAccount.DateOfBirth || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Password:</strong>
                  <input
                    type="password"
                    name="PasswordHash"
                    value={editedAccount.PasswordHash}
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
                  <strong>ID:</strong> {account.Id}
                </p>
                <p>
                  <strong>Role ID:</strong> {account.RoleId}
                </p>
                <p>
                  <strong>Email:</strong> {account.Email}
                </p>
                <p>
                  <strong>Username:</strong> {account.Username}
                </p>
              </div>
              <div>
                <p>
                  <strong>Image URL:</strong>
                </p>
                <img
                  src={account.ImageUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
                <p>
                  <strong>Phone Number:</strong> {account.PhoneNumber || 'N/A'}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {account.DateOfBirth || 'N/A'}
                </p>
              </div>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <div className="mt-4">
            <p>
              <strong>Insert Date:</strong> {account.InsDate}
            </p>
            <p>
              <strong>Update Date:</strong> {account.UpsDate}
            </p>
          </div>
          {isEditing ? (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu'}
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
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

export default AccountDetailModal;
