import React, { useState } from 'react';
import { updateAccount, updateDeflag } from '../../api/Account/AccountApi';
import RejectionModal from '../Modals/RejectionModal';
import { toast } from 'react-toastify';

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
    // if (!editedAccount.PasswordHash) {
    //   setError('Mật khẩu không được để trống.');
    //   toast.error('Vui lòng điền mật khẩu.');
    //   return;
    // }

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
    '9959ce96-de26-40a7-b8a7-28a704062e89': {
      name: 'Nhân viên báo giá',
      color: 'bg-blue-500',
    },
    '7af0d75e-1157-48b4-899d-3196deed5fad': {
      name: 'Nhân viên thiết kế',
      color: 'bg-pink-500',
    },
    'a3bb42ca-de7c-4c9f-8f58-d8175f96688c': {
      name: 'Quản lý',
      color: 'bg-green-500',
    },
    '789dd57d-0f75-40d1-8366-ef6ab582efc8': {
      name: 'Khách hàng',
      color: 'bg-yellow-500',
    },
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
        onClick={handleOutsideClick}
      >
        <div
          className="relative w-full max-w-4xl mx-auto my-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none dark:bg-boxdark">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-solid rounded-t border-blueGray-200 dark:border-strokedark">
              <h3 className="text-2xl font-semibold text-black dark:text-white">
                Chi tiết Hồ sơ
              </h3>
              <button
                className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                onClick={onClose}
              >
                <span className="block w-6 h-6 text-2xl text-black bg-transparent opacity-5 focus:outline-none">
                  ×
                </span>
              </button>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
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
            </div>

            {/* Content */}
            <div className="relative flex-auto p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-center md:col-span-1">
                  <div className="mb-4">
                    <img
                      src={
                        isEditing ? editedAccount.ImageUrl : account.ImageUrl
                      }
                      alt="Avatar"
                      className="object-cover w-48 h-48 rounded-full border-4 border-primary shadow-lg"
                    />
                  </div>
                  {/* {isEditing && (
                    <input
                      type="text"
                      name="ImageUrl"
                      value={editedAccount.ImageUrl}
                      onChange={handleInputChange}
                      placeholder="Nhập URL ảnh đại diện"
                      className="w-full px-3 py-2 mt-2 border rounded"
                    />
                  )} */}
                </div>

                {/* Personal Information */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 text-lg font-semibold border-b pb-2">
                        Thông tin cá nhân
                      </h4>
                      {isEditing ? (
                        <>
                          <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold">
                              Tên người dùng
                            </label>
                            <input
                              type="text"
                              name="Username"
                              value={editedAccount.Username}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold">
                              Ngày sinh
                            </label>
                            <input
                              type="date"
                              name="DateOfBirth"
                              value={editedAccount.DateOfBirth || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-2">
                            <strong>Tên:</strong> {account.Username}
                          </p>
                          <p>
                            <strong>Ngày sinh:</strong>{' '}
                            {account.DateOfBirth || 'Chưa cập nhật'}
                          </p>
                        </>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-3 text-lg font-semibold border-b pb-2">
                        Thông tin liên hệ
                      </h4>
                      {isEditing ? (
                        <>
                          <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold">
                              Email
                            </label>
                            <input
                              type="email"
                              name="Email"
                              value={editedAccount.Email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block mb-2 text-sm font-bold">
                              Số điện thoại
                            </label>
                            <input
                              type="tel"
                              name="PhoneNumber"
                              value={editedAccount.PhoneNumber || ''}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border rounded"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="mb-2">
                            <strong>Email:</strong> {account.Email}
                          </p>
                          <p>
                            <strong>Số điện thoại:</strong>{' '}
                            {account.PhoneNumber || 'Chưa cập nhật'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200 dark:border-strokedark">
              {isEditing ? (
                <>
                  <button
                    className="px-6 py-2 mr-2 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-secondaryGreenButton active:bg-primaryDarkGreen hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={handleSave}
                  >
                    {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="px-6 py-2 mr-2 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                    type="button"
                    onClick={() => setShowRejectionModal(true)}
                  >
                    Khóa tài khoản
                  </button>
                  <button
                    className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-secondaryGreenButton active:bg-primaryDarkGreen hover:shadow-lg focus:outline-none"
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </button>
                </>
              )}
            </div>
          </div>
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
