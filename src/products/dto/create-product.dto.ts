import { Optional } from "@nestjs/common";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsCurrency, IsObject, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {
    @Optional()
    _id:string
    @IsString()
    ProductName:string;
    @IsString()
    @MinLength(20)
    description:string;
    @Min(500)
    //@IsCurrency()
    price:number;
    @IsArray()
    @ArrayMinSize(1,{message:'Debe de contener como minimo una imagen cada producto'})
    @ArrayMaxSize(5,{message:'Cada producto tiene como limite 5 imagenes'})
    images:string[];
    @IsArray()
    @ArrayMinSize(1,{message:'Debe de contener como minimo una ventaja cada producto'})
    @ArrayMaxSize(5,{message:'Cada producto tiene como limite 5 ventajas'})
    adventages:string[];
    @IsArray()
    @ArrayMinSize(1,{message:'Debe de contener como minimo una desventaja cada producto'})
    @ArrayMaxSize(5,{message:'Cada producto tiene como limite 5 desventajas'})
    disadventages:string[];
    sizes:any
}
