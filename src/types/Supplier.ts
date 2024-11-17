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
    InsDate?: string;
    UpsDate?: string
    Deflag: boolean
    ShortDescription?: string;
    Description?: string;
}

export interface UpdateSupplierRequest {
    name: string;
    email: string;
    constractPhone: string;
    imgUrl: string;
    shortDescription: string;
    description: string;
    deflag: boolean;
}
