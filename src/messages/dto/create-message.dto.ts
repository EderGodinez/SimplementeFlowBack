import {  IsString, MinLength } from "class-validator";

export class CreateMessageDto {
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(15,{message:`Un correo no puede tener una logitud menor a 15 caracteres.`})
    UserEmail:string;
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(5,{message:`Un nombre no puede tener una logitud menor a 5 caracteres.`})
    username:string;
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(10,{message:`El asunto no puede tener una logitud menor a 10 caracteres.`})
    issue:string
    @IsString({message:'El campo debe de ser texto'})
    @MinLength(30,{message:`Un mensaje no puede tener una logitud menor a 30 caracteres.`})
    Content:string
}
