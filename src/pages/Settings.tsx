import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import {
  getProfile,
  updateAccountProfile,
  uploadProfileImage,
  changePassword,
  ChangePasswordRequest,
} from '../api/Account/AccountApi';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { Profile } from '../types/Account';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
  });
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    currentPassword: '',
    newPassword: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
        setFormData({
          username: userProfile.Username || '',
          email: userProfile.Email || '',
          phoneNumber: userProfile.PhoneNumber || '',
          dateOfBirth: userProfile.DateOfBirth
            ? new Date(userProfile.DateOfBirth).toISOString().split('T')[0]
            : '',
        });
        setIsLoading(false);
      } catch (error) {
        toast.error('Không thể tải thông tin cá nhân');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh JPG, PNG hoặc GIF');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) {
      toast.error('Không tìm thấy thông tin tài khoản');
      return;
    }

    setIsUpdating(true);

    try {
      const updatedProfile = await updateAccountProfile(profile.Id, {
        Id: profile.Id,
        Username: formData.username,
        PhoneNumber: formData.phoneNumber,
        DateOfBirth: formData.dateOfBirth,
      });

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        name: formData.username,
        mobilephone: formData.phoneNumber,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setProfile(updatedProfile);

      toast.success('Cập nhật thông tin thành công');
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveImage = async () => {
    if (!profile || !selectedFile) {
      toast.error('Vui lòng chọn ảnh');
      return;
    }

    try {
      const newImageUrl = await uploadProfileImage(selectedFile, profile.Id);

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...currentUser,
        ImgUrl: newImageUrl,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      const updatedProfile = {
        ...profile,
        ImageUrl: newImageUrl,
      };
      setProfile(updatedProfile);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      window.location.reload();
      toast.success('Cập nhật ảnh đại diện thành công');
    } catch (error) {
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword(passwordData);
      toast.success('Đổi mật khẩu thành công');

      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
      });
      setConfirmPassword('');
    } catch (error: any) {
      // Xử lý lỗi từ API
      if (error.response && error.response.data) {
        const apiError = error.response.data;

        switch (apiError.StatusCode) {
          case 401:
            toast.error(apiError.Error || 'Mật khẩu cũ không đúng');
            break;
          default:
            toast.error(apiError.Error || 'Có lỗi xảy ra khi đổi mật khẩu');
        }
      } else {
        toast.error('Có lỗi xảy ra khi đổi mật khẩu');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (type: 'current' | 'new' | 'confirm') => {
    switch (type) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={'#5BABAC'} loading={true} />
      </div>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Cài đặt tài khoản" />

      <div className="mx-auto max-w-350">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-9">
          <div className="md:col-span-1 flex flex-col gap-9">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Ảnh Đại Diện
                </h3>
              </div>
              <div className="p-7">
                <form>
                  <div className="mb-4 flex items-center justify-center gap-3">
                    <div className="h-32 w-32 rounded-full">
                      <img
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : profile?.ImageUrl || '/default-avatar.png'
                        }
                        alt="User Avatar"
                        className="h-full w-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      className="text-sm hover:text-primary"
                      onClick={triggerFileInput}
                    >
                      Thay Đổi Ảnh
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {selectedFile && (
                    <div className="flex justify-center gap-4.5 mt-4">
                      <button
                        type="button"
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        onClick={handleSaveImage}
                      >
                        Lưu Ảnh
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Đổi Mật Khẩu
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                        Mật Khẩu Hiện Tại
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 pr-10 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                          onClick={() => togglePasswordVisibility('current')}
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                        Mật Khẩu Mới
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 pr-10 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          placeholder="Nhập mật khẩu mới"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                        Xác Nhận Mật Khẩu Mới
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 pr-10 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          placeholder="Xác nhận mật khẩu mới"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {isChangingPassword ? 'Đang Đổi...' : 'Đổi Mật Khẩu'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Thông Tin Cá Nhân
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                      Tên Người Dùng
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                      Số Điện Thoại
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                      Địa Chỉ Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      placeholder="Nhập địa chỉ email"
                      readOnly
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-black dark:text-white">
                      Ngày Sinh
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                    >
                      {isUpdating ? 'Đang Lưu...' : 'Lưu Thay Đổi'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
