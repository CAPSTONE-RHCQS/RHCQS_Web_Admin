import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_ROOT } from './constants';

// Custom Axios Type
enum AxiosClientFactoryEnum {
  LOGIN = 'login',
}

const parseParams = (params: any): string => {
  const keys = Object.keys(params);
  let options = '';

  keys.forEach((key) => {
    const isParamTypeObject = typeof params[key] === 'object';
    const isParamTypeArray =
      isParamTypeObject &&
      Array.isArray(params[key]) &&
      params[key].length >= 0;

    if (!isParamTypeObject) {
      options += `${key}=${params[key]}&`;
    }

    if (isParamTypeObject && isParamTypeArray) {
      params[key].forEach((element: any) => {
        options += `${key}=${element}&`;
      });
    }
  });

  return options ? options.slice(0, -1) : options;
};

const account = `${API_ROOT}`;

const requestWebRHCQS = axios.create({
  baseURL: account,
  paramsSerializer: parseParams,
});

requestWebRHCQS.interceptors.request.use((options) => {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  return options;
});

const requestLogin: AxiosInstance = axios.create({
  baseURL: account,
  paramsSerializer: parseParams,
});

requestLogin.interceptors.request.use((options) => {
  const { method } = options;

  if (method === 'put' || method === 'post') {
    Object.assign(options.headers, {
      'Content-Type': 'application/json;charset=UTF-8',
    });
  }

  return options;
});

requestLogin.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) =>
    Promise.reject((error.response && error.response.data) || 'Có lỗi xảy ra'),
);

class AxiosClientFactory {
  static getAxiosClient(
    type: string,
    config: AxiosRequestConfig = {},
  ): AxiosInstance | undefined {
    switch (type) {
      case AxiosClientFactoryEnum.LOGIN:
        return requestLogin;
      default:
        return undefined;
    }
  }
}

const axiosClientFactory = new AxiosClientFactory();

export const axiosInstances = {
  login: AxiosClientFactory.getAxiosClient(AxiosClientFactoryEnum.LOGIN),
};

export default requestWebRHCQS;
