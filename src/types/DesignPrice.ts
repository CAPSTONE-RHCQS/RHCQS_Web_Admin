export type DesignPrice = DesignPriceItem[]

export interface DesignPriceItem {
  Id: string
  AreaFrom: number
  AreaTo: number
  Price: number
  InsDate: string
  UpsDate: string
}

export interface DesignPriceRequest {
  areaFrom: number
  areaTo: number
  price: number
}
