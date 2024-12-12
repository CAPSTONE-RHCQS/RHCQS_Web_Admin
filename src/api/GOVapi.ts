import axios from 'axios';

const BASE_URL = 'https://cuckinhtexd.gov.vn/SearchDinhMuc/SearchDinhMuc';

export interface ConstructionWorkItem {
  IDCongViecDinhMuc: number;
  IDChuongMucDinhMuc: number;
  Ma: string;
  Ten: string;
  DonViTinh: string;
  MoTa: string | null;
  TenDinhMuc: string | null;
  TenChuongMuc: string | null;
  SoHieu: string | null;
  NgayBanHanh: string | null;
  HapPhiDinhMucs: string | null;
  TotalRow: number;
}

export interface DinhMucResponse {
  Items: ConstructionWorkItem[];
  TotalRow: number;
  PageIndex: number;
  pageSize: number;
}

interface SearchParams {
  pageIndex: number;
  tenCongViec: string;
}

export const fetchDinhMuc = async ({
  pageIndex,
  tenCongViec,
  maCongViec,
}: SearchParams & { maCongViec: string }): Promise<DinhMucResponse> => {
  try {
    const response = await axios.get<DinhMucResponse>(BASE_URL, {
      params: {
        pageIndex,
        maCongViec,
        tenCongViec,
        idDinhMuc: 1292,
        excel: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
