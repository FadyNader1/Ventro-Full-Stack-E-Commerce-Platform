import { Icategory } from "./icategory"

export interface Iproduct {
  id: number
  name: string
  description: string
  keySpecs: string
  oldPrice: number
  newPrice: number
  category: Icategory
  photos: string[]
  isFeatured: boolean;
  isNewArrival: boolean;
  inventoryQuantity: number;
  pictureUrl:string;
  rating: number;
}
export interface HomeProducts {
  latestProducts: Iproduct[];
  featuredProducts: Iproduct[];
  offerProducts: Iproduct[];
}
