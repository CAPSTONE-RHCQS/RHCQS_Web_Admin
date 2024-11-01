import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { postLogin } from '../../api/Authen/login';
import { jwtDecode } from 'jwt-decode';
import PhoneSvg from '../../SVG/SignIn/PhoneSvg';
import EmailSvg from '../../SVG/SignIn/EmailSvg';
import LockSvg from '../../SVG/SignIn/LockSvg';

interface JwtPayload {
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  exp: number;
  ImgUrl: string;
}

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = await postLogin(email, password);
      const decodedToken = jwtDecode<JwtPayload>(data.Token);
      const userData = {
        role: decodedToken[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ],
        mobilephone:
          decodedToken[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'
          ],
        name: decodedToken[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
        ],
        nameidentifier:
          decodedToken[
            'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
          ],
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.Token);
      localStorage.setItem('alertMessage', 'Đăng nhập thành công!');
      localStorage.setItem('alertType', 'success');
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage =
        error.response?.data?.Error || 'Đăng nhập thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-boxdark"
      style={{
        backgroundImage: `url('https://img.upanh.tv/2024/11/01/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        style={{ filter: 'blur(8px)' }}
      ></div>
      <div className="relative flex flex-wrap w-full max-w-4xl bg-white rounded-lg shadow-md dark:bg-boxdark">
        <div className="hidden xl:flex xl:w-1/2 items-center justify-center bg-gray-200 dark:bg-boxdark-2">
          <div className="p-8 text-center">
            <span className="inline-block">
              <PhoneSvg />
            </span>
          </div>
        </div>
        <div className="w-full xl:w-1/2 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-black dark:text-white">
            Đăng nhập quản trị RHCQS
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-black dark:text-white">
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  className="w-full px-4 py-2 border rounded-lg border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute right-4 top-3">
                  <EmailSvg />
                </span>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-black dark:text-white">
                Nhập mật khẩu
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-2 border rounded-lg border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute right-4 top-3 cursor-pointer"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <LockSvg />
                </span>
              </div>
            </div>

            <div>
              <input
                type="submit"
                value="Đăng nhập"
                className={`w-full py-2 text-white bg-primary rounded-lg cursor-pointer transition hover:bg-opacity-90 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
