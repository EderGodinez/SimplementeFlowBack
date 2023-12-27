import {  IsEmail, MinLength } from 'class-validator';
export class LoginDto{
    @IsEmail({},{message:'Debe de contar con un formato de correo valida'})
    email:string;
    @MinLength(10,{message:'Contraseña invalida debe de ser minimo de 10 caracteres'})
    password:string
}