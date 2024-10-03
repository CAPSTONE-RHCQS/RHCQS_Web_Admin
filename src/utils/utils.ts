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
