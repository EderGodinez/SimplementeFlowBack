import { ArrayMaxSize, ArrayMinSize, IsArray, IsCurrency, IsObject, IsString, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    ProductName:string;
    @IsString()
    @MinLength(20)
    description:string;
    @MinLength(4)
    @IsCurrency()
    price:number;
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(5)
    images:string[];
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(4)
    adventages:string[];
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(4)
    disadventages:string[];
}
