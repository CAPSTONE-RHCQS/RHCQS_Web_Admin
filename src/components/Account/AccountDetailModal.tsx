import React, { useState } from 'react';
import { updateAccount, updateDeflag } from '../../api/Account/AccountApi';
import RejectionModal from '../Modals/RejectionModal';
import { toast } from 'react-toastify';
// import Alert from '../Alert'; // Loại bỏ import Alert

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
      toast.success('Khóa tài khoản thành công');
      onClose();
    } catch (error) {
      console.error('Error updating deflag:', error);
      toast.error('Có lỗi xảy ra khi khóa tài khoản.');
    }
  };

  const roleMapping: { [key: string]: { name: string; color: string } } = {
    '9959ce96-de26-40a7-b8a7-28a704062e89': { name: 'Sales Staff', color: 'bg-blue-500' },
    '7af0d75e-1157-48b4-899d-3196deed5fad': { name: 'Design Staff', color: 'bg-pink-500' },
    'a3bb42ca-de7c-4c9f-8f58-d8175f96688c': { name: 'Manager', color: 'bg-green-500' },
    '789dd57d-0f75-40d1-8366-ef6ab582efc8': { name: 'Customer', color: 'bg-yellow-500' },
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
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition"
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
          <h2 className="text-xl font-bold mb-4">Chi tiết Hồ sơ</h2>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
                <label>
                  <strong>Username:</strong>
                  <input
                    type="text"
                    name="Username"
                    value={editedAccount.Username}
                    onChange={handleInputChange}
                    placeholder="Nhập tên người dùng"
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Ảnh đại diện:</strong>
                  <input
                    type="text"
                    name="ImageUrl"
                    value={editedAccount.ImageUrl}
                    onChange={handleInputChange}
                    placeholder="Nhập URL ảnh đại diện"
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Vai trò:</strong>
                  <div className={`p-2 rounded ${roleMapping[editedAccount.RoleId]?.color || 'bg-gray-500'}`}>
                    {roleMapping[editedAccount.RoleId]?.name || 'Unknown Role'}
                  </div>
                </label>
                <label>
                  <strong>Ngày sinh:</strong>
                  <input
                    type="date"
                    name="DateOfBirth"
                    value={editedAccount.DateOfBirth || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </label>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Thông tin liên hệ</h3>
                <label>
                  <strong>Email:</strong>
                  <input
                    type="text"
                    name="Email"
                    value={editedAccount.Email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                    className="w-full border rounded p-2"
                  />
                </label>
                <label>
                  <strong>Số điện thoại:</strong>
                  <input
                    type="text"
                    name="PhoneNumber"
                    value={editedAccount.PhoneNumber || ''}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                    className="w-full border rounded p-2"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Thông tin cá nhân</h3>
                <p>
                  <strong>Username:</strong> {account.Username}
                </p>
                <p>
                  <strong>Ảnh đại diện:</strong>
                </p>
                <img
                  src={account.ImageUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full"
                />
                <p>
                  <strong>Vai trò:</strong>
                  <span className={`p-2 rounded ${roleMapping[account.RoleId]?.color || 'bg-gray-500'}`}>
                    {roleMapping[account.RoleId]?.name || 'Unknown Role'}
                  </span>
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {account.DateOfBirth || 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Thông tin liên hệ</h3>
                <p>
                  <strong>Email:</strong> {account.Email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {account.PhoneNumber || 'N/A'}
                </p>
              </div>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Thông tin tài khoản</h3>
            <p>
              <strong>Ngày tạo:</strong> {account.InsDate}
            </p>
            <p>
              <strong>Ngày cập nhật:</strong> {account.UpsDate}
            </p>
          </div>
          {isEditing ? (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => setShowRejectionModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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
