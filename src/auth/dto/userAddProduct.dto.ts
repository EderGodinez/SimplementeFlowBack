import { IsNumber, IsString, Min } from "class-validator";


export class userAddProduct{
    @IsString({message:'El id del usuario debe de ser un string'})
    UserID:string
    @IsString({message:'El id del producto debe de ser un string'})
    ProductId:string
    @IsNumber()
    @Min(5,{message:'Talla invalida'})
    size?:number
    @IsNumber()
    @Min(0,{message:'La cantidad de productos debe de ser mayor a 0'})
    quantity:number
}