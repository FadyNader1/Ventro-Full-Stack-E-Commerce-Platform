export interface OrderDto {
  
  basketId: string
  shippingAddress: ShippingAddress
  deleiveryMethodId: number
}

export interface ShippingAddress {
  fullName: string
  country: string
  city: string
  street: string
  postalCode: string
}
export interface OrderResponse {
  id: number
  buyerEmail: string
  subtotal: number
  total: number
  orderDate: string
  shippingAddress: ShippingAddress
  orderItems: OrderItem[]
  deliveryMethod: string
  status: string
}


export interface OrderItem {
  id: number
  productName: string
  mainImageUrl: string
  price: number
  quantity: number
}

export interface IDeliveryMethodResponse{
  success: boolean
  message: string
  meta: null
  data: IDeliveryMethod[] | IDeliveryMethod
}
export interface IDeliveryMethod{
  id: number 
  name: string
  price: number
  deleveryDays: number
  description: string
}

  
    
  