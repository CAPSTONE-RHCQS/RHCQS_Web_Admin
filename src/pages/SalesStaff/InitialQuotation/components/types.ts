export interface TableRow {
  stt: number;
  hangMuc: string;
  dTich: string;
  heSo: string;
  dienTich: string;
  donVi: string;
  price: number;
  uniqueId?: string;
  constructionItemId?: string;
  subConstructionId?: string | null;
}

export interface OptionRow {
  stt: number;
  hangMuc: string;
  soLuong: number;
  heSo: number;
  thanhTien: number;
} 