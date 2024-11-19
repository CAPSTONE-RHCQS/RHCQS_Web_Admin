// MaterialSectionListResponse
export interface MaterialSectionListResponse {
    Size: number
    Page: number
    Total: number
    TotalPages: number
    Items: MaterialSectionItem[]
}

export interface MaterialSectionItem {
    Id: string
    Name: string
    Code: string
    Type: string
    InsDate: string
}

export interface MaterialListResponse {
    Size: number
    Page: number
    Total: number
    TotalPages: number
    Items: MaterialItem[]
}


// MaterialItem
export interface MaterialItem {
    Id: string
    Name: string
    Price?: number
    Unit: string
    Size?: string
    Shape?: string
    ImgUrl: any
    Description?: string
    IsAvailable: boolean
    UnitPrice: string
    MaterialSectionId: string
    SupplierId: string
    SupplierName: string
    MaterialSectionType: string
    Code: string
}

export interface MaterialRequest {
    SupplierId: string
    MaterialSectionId: string
    Name: string
    Price: number
    Unit: string
    Size: string
    Shape: string
    Description: string
    IsAvailable: boolean
    UnitPrice: string
    Image: string
}
