import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsIn, IsNumber, IsString, ValidateNested } from "class-validator";
import { shopping_car } from "src/auth/entities/shoppingcar.entity";

export class CreateOrderDto {
  @ApiProperty()
    @IsString()
    UserId: string;
    @ApiProperty()
    @ValidateNested({ each: true}) // Usa @ValidateNested para validar objetos anidados.
    @ArrayMinSize(1) // Al menos un elemento en el arreglo.
    @Type(() => shopping_car) // Especifica que tipo de clase representa el arreglo.
    Details: shopping_car[];
}
