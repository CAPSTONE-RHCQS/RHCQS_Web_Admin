export interface SupplierListResponse {
    Size: number;
    Page: number;
    Total: number;
    TotalPages: number;
    Items: SupplierItem[];
}

export interface SupplierItem {
    Id: string;
    Name: string;
    Email?: string;
    ConstractPhone?: string;
    ImgUrl: any;
    Code?: string;
    InsDate?: string;
    UpsDate?: string
    Deflag: boolean
    ShortDescription?: string;
    Description?: string;
    Image?: string;
}

export interface UpdateSupplierRequest {
    Name: string;
    Email: string;
    ConstractPhone: string;
    ImgUrl: string | null;
    Code: string;
    ShortDescription: string;
    Description: string;
    Deflag: boolean;
    Image: string;
}
