import React, { useState } from 'react';
import { createStaff } from '../../../../../api/Account/AccountApi';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CreateStaffAccountModalProps {
  onClose: () => void;
  onAccountCreated: () => void;
}

const CreateStaffAccountModal: React.FC<CreateStaffAccountModalProps> = ({
  onClose,
  onAccountCreated,
}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('SalesStaff');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !phoneNumber || !password || !confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    try {
      setIsLoading(true);
      await createStaff(email, phoneNumber, password, confirmPassword, role);

      toast.success('Tạo tài khoản hệ thống thành công');
      onAccountCreated();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-boxdark">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-xl font-semibold text-black dark:text-white">
              Tạo Tài Khoản Hệ Thống
            </h3>
            <button
              className="float-right p-1 ml-auto bg-transparent border-0 text-black opacity-5 text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="w-6 h-6 text-black dark:text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="relative p-6 flex-auto">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-black dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
                placeholder="Nhập địa chỉ email"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                Số Điện Thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-black dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                Mật Khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-black dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
                placeholder="Nhập mật khẩu"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                Xác Nhận Mật Khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-black dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                required
                placeholder="Xác nhận mật khẩu"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                Vai Trò <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm leading-tight text-black dark:text-white border rounded shadow focus:outline-none focus:shadow-outline"
              >
                <option value="DesignStaff">Nhân Viên Thiết Kế</option>
                <option value="SalesStaff">Nhân Viên Báo Giá</option>
                <option value="Manager">Quản Lý Hệ Thống</option>
              </select>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
              <button
                type="button"
                className="px-6 py-2 mb-1 mr-4 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-primary hover:shadow-lg focus:outline-none disabled:opacity-50"
              >
                {isLoading ? 'Đang Tạo...' : 'Tạo Tài Khoản'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStaffAccountModal;
