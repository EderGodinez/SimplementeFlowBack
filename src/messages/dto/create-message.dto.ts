import { ApiProperty } from "@nestjs/swagger";
import {  IsString, MinLength } from "class-validator";

export class CreateMessageDto {
    @ApiProperty()
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(15,{message:`Un correo no puede tener una logitud menor a 15 caracteres.`})
    UserEmail:string;
    @ApiProperty()
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(5,{message:`Un nombre no puede tener una logitud menor a 5 caracteres.`})
    username:string;
    @ApiProperty()
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(10,{message:`El asunto no puede tener una logitud menor a 10 caracteres.`})
    issue:string
    @ApiProperty()
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(30,{message:`Un mensaje no puede tener una logitud menor a 30 caracteres.`})
    Content:string
}
