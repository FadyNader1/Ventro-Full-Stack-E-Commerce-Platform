import { ShippingAddress } from "./Iorder-dto"

    
export interface ApiResponse {
  success: boolean
  message: string
  meta: any
  data: Data
}

export interface Data {
  basketId: string
  items: Item[]
  emailBuyer: any
  paymentIntentId: string
  clientSecret: string
  shippingAddress: ShippingAddress
  deliveryMethodId: number
  shippingPrice: number

 
}

export interface Item {
  productId: number
  productName: string
  description: string
  oldPrice: number
  newPrice: number
  photos: string[]
  quantity: number
}
export interface AddToBasketDto{
   basketId: string
    productId:number | null
    quantity:number | null
    deliveryMethodId:number|null
    shippingAddress:ShippingAddress|null
    ShipPrice:number | null
    EmailBuyer:string | null

}


