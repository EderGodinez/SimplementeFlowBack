import { Type } from "class-transformer";
import { ArrayMinSize, IsIn, IsNumber, IsString, ValidateNested } from "class-validator";
class OrderProduct {
    @IsString()
    productName: string;
    @IsNumber()
    Amount: number;
    @IsNumber()
    Price: number;
  }
export class CreateOrderDto {
    @IsString()
    UserId: string;
    @IsString()
    PayMethod: string;
    @ValidateNested({ each: true}) // Usa @ValidateNested para validar objetos anidados.
    @ArrayMinSize(1) // Al menos un elemento en el arreglo.
    @Type(() => OrderProduct) // Especifica que tipo de clase representa el arreglo.
    Details: OrderProduct[];
    @IsString()
    @IsIn(['payed', 'cancel' , 'pendient' , 'complete'])
    status:string;
}
