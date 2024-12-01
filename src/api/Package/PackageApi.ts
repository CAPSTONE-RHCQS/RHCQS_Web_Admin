import requestWebRHCQS from '../../utils/axios';
import { AxiosResponse, AxiosError } from 'axios';
import { Package } from '../../types/PackagesTypes';
import { GetPackageByNameResponse } from '../../types/SearchContainNameTypes';
import { PackagePutRequest } from '../../types/PackageRequestTypes';

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

export const getPackageById = async (
  id: string,
): Promise<AxiosResponse<Package>> => {
  try {
    const response = await requestWebRHCQS.get<Package>(`/package/id`, {
      params: { id },
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

export const putPackage = async (
  packageId: string,
  packageData: PackagePutRequest,
): Promise<AxiosResponse<void>> => {
  try {
    console.log('putPackage', packageId, packageData);
    const response = await requestWebRHCQS.put<void>(`/package`, packageData, {
      params: { packageid: packageId },
      headers: { 'Content-Type': 'application/json' },
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

export async function getPackageByName(
  name: string,
): Promise<GetPackageByNameResponse> {
  try {
    const response = await requestWebRHCQS.get('/package/contain/name', {
      params: { name },
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching package by name ${name}:`, error);
    throw new Error('Failed to fetch package by name');
  }
}
