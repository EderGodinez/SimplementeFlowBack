import { Type } from "class-transformer";
import { ArrayMinSize, IsIn, IsNumber, IsString, ValidateNested } from "class-validator";
export class OrderProduct {
    @IsString()
    productDescription: string;
    @IsString()
    productName: string;
    @IsString()
    Image: string;
    @IsNumber()
    Size: number;
    @IsNumber()
    Amount: number;
    @IsNumber()
    Price: number;
  }
export class CreateOrderDto {
    @IsString()
    UserId: string;
    @ValidateNested({ each: true}) // Usa @ValidateNested para validar objetos anidados.
    @ArrayMinSize(1) // Al menos un elemento en el arreglo.
    @Type(() => OrderProduct) // Especifica que tipo de clase representa el arreglo.
    Details: OrderProduct[];
}
