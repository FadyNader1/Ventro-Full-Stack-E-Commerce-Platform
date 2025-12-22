import { Icategory } from "./icategory"
import { Imeta } from "./imeta"
import { Iproduct } from "./iproduct"

export interface Iapiresponse {
  success: boolean
  message: string
  meta: Imeta | null
  data: WishListResponse[] 
}
export interface WishListResponse {
  id: number
  appUserId: string
  product: Iproduct | null
  createdDate: string
}



