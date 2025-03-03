// set localstorage
export const setLocalStorage = (name: string, value: string): void => {
  localStorage.setItem(name, value);
};

// get localstorage
export const getLocalStorage = (name: string): string | null => {
  return localStorage.getItem(name);
};

export const removeLocalStorage = (key: string): void => {
  localStorage.removeItem(key);
};

export const removeUserInfo = (): void => {
  localStorage.removeItem('USER_INFO');
};

export const setUserInfo = (userInfo: any): void => {
  if (userInfo) {
    setLocalStorage('USER_INFO', JSON.stringify(userInfo));
  }
};

export const getUserInfo = (): string | null => {
  return getLocalStorage('USER_INFO');
};

export const getCacheBustedUrl = (url: string): string => {
  return `${url}?${new Date().getTime()}`;
};

export const getStatusLabelInitalQuoteDetail = (status: string) => {
  const statusLabelMap: { [key: string]: string } = {
    Pending: 'Chờ xử lý',
    Processing: 'Đang xử lý',
    Reviewing: 'Chờ xác nhận quản lý',
    Approved: 'Quản lý đã xác nhận',
    Rejected: 'Từ chối báo giá',
    Updating: 'Đang chỉnh sửa',
    Finalized: 'Hoàn thành',
    Canceled: 'Đã chấm dứt',
    Ended: 'Đã đóng',
  };
  return statusLabelMap[status] || 'Không xác định';
};

export const getStatusLabelFinalQuoteDetail = (status: string) => {
  const statusLabelMap: { [key: string]: string } = {
    Pending: 'Chờ xử lý',
    Processing: 'Đang xử lý',
    Reviewing: 'Chờ xác nhận quản lý',
    Approved: 'Quản lý đã xác nhận',
    Rejected: 'Từ chối báo giá',
    Updating: 'Đang chỉnh sửa',
    Finalized: 'Hoàn thành',
    Canceled: 'Đã chấm dứt',
    Ended: 'Đã đóng',
  };
  return statusLabelMap[status] || 'Không xác định';
};
