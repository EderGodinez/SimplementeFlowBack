import { IsString } from 'class-validator';
import {  IsEmail, MinLength } from 'class-validator';
export class LoginDto{
    @IsString({message:'El formato del correo debe de ser en string'})
    @IsEmail({},{message:'Debe de contar con un formato de correo valida'})
    email:string;
    @IsString({message:'El formato de la contraseña debe de ser en string'})
    @MinLength(10,{message:'Contraseña invalida debe de ser minimo de 10 caracteres'})
    password:string
}