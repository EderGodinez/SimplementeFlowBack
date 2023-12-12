import { Product } from "../entities/product.entity"

export interface ProductUpdatedResponse{
    message:string
    product?:Product
}