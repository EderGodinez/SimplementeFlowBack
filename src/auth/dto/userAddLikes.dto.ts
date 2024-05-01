import { IsString } from "class-validator"

export class userAddLike{
    @IsString({message:'El id del usuario debe de ser un string'})
    UserID:string
    @IsString({message:'El id debe de ser un string'})
    productId:string
}