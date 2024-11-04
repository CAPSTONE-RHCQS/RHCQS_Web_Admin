import requestWebRHCQS from '../../utils/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { Package } from '../../types/PackagesTypes';

interface PackageResponse {
  Size: number;
  Page: number;
  Total: number;
  TotalPages: number;
  Items: Package[];
}


export interface PackageTypeSearchResponse {
  PackageId: string;
  PackageName: string;
  Type: string;
  Price: number;
}

export const fetchPackages = async (
  page: number = 1,
  size: number = 10,
): Promise<AxiosResponse<PackageResponse>> => {
  try {
    const response = await requestWebRHCQS.get<PackageResponse>('/package', {
      params: { page, size },
      headers: { accept: 'text/plain' },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response && error.response.data) || 'Có lỗi xảy ra',
      );
    } else {
      throw new Error('Có lỗi xảy ra');
    }
  }
};

export const searchPackagesByName = async (
  name: string,
): Promise<AxiosResponse<PackageTypeSearchResponse[]>> => {
  try {
    const response = await requestWebRHCQS.get<PackageTypeSearchResponse[]>(
      `/package/contain/name?name=${name}`,
      {
        headers: { accept: 'text/plain' },
      },
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        (error.response && error.response.data) || 'Có lỗi xảy ra',
      );
    } else {
      throw new Error('Có lỗi xảy ra');
    }
  }
};

