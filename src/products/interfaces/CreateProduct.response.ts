import { Product } from "../entities/product.entity"

export interface CreateProductResponse{
    product?:Product
    message:string
    status:number
}