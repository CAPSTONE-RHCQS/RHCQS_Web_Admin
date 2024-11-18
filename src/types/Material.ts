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
    InsDate: string
}

export interface MaterialListResponse {
    Size: number
    Page: number
    Total: number
    TotalPages: number
    Items: MaterialItem[]
}

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
    MaterialSectionName: string
    SupplierName: string
}
